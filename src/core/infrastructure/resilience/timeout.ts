/**
 * Gerenciamento de timeout para requisições N8N
 * @module core/infrastructure/resilience/timeout
 */

import { TimeoutError } from '../n8n/errors';

// ============================================================================
// Interfaces
// ============================================================================

export interface TimeoutConfig {
  /** Tempo limite em ms */
  timeout: number;
  /** Callback opcional executado quando timeout ocorre */
  onTimeout?: (timeoutMs: number) => void;
}

export interface TimeoutMetrics {
  totalRequests: number;
  timeouts: number;
  timeoutRate: number;
  averageResponseTime: number;
  endpointMetrics: Record<
    string,
    {
      timeouts: number;
      totalRequests: number;
      averageResponseTime: number;
    }
  >;
}

// ============================================================================
// Função withTimeout
// ============================================================================

/**
 * Wrapper para adicionar timeout a Promises
 * @param promise - Promise a ser executada
 * @param timeoutMs - Tempo limite em ms
 * @param errorMessage - Mensagem de erro customizada
 * @returns Resultado da promise ou lança TimeoutError
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage?: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new TimeoutError(
          errorMessage || `Operação excedeu tempo limite de ${timeoutMs}ms`,
          timeoutMs
        )
      );
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timeoutId!);
  }
}

// ============================================================================
// Classe TimeoutManager
// ============================================================================

/**
 * Gerenciador de timeouts para múltiplas requisições
 */
export class TimeoutManager {
  private timeoutsByEndpoint: Map<string, number> = new Map();
  private activeTimeouts: Set<NodeJS.Timeout> = new Set();

  private metrics: TimeoutMetrics = {
    totalRequests: 0,
    timeouts: 0,
    timeoutRate: 0,
    averageResponseTime: 0,
    endpointMetrics: {},
  };

  constructor(private defaultTimeout: number = 30000) {}

  /**
   * Executa função com timeout
   */
  async execute<T>(fn: () => Promise<T>, endpoint: string, customTimeout?: number): Promise<T> {
    // Determinar timeout (customizado > por endpoint > padrão)
    const timeout = customTimeout || this.timeoutsByEndpoint.get(endpoint) || this.defaultTimeout;

    const startTime = Date.now();

    // Atualizar métricas
    this.metrics.totalRequests++;
    if (!this.metrics.endpointMetrics[endpoint]) {
      this.metrics.endpointMetrics[endpoint] = {
        timeouts: 0,
        totalRequests: 0,
        averageResponseTime: 0,
      };
    }
    this.metrics.endpointMetrics[endpoint].totalRequests++;

    try {
      const result = await withTimeout(
        fn(),
        timeout,
        `Requisição para ${endpoint} excedeu ${timeout}ms`
      );

      // Calcular tempo de resposta
      const responseTime = Date.now() - startTime;
      this.updateResponseTime(endpoint, responseTime);

      return result;
    } catch (error) {
      if (error instanceof TimeoutError) {
        // Registrar timeout
        this.metrics.timeouts++;
        this.metrics.endpointMetrics[endpoint].timeouts++;
        this.metrics.timeoutRate = this.metrics.timeouts / this.metrics.totalRequests;

        // Log timeout
        console.warn(`[TimeoutManager] Timeout em ${endpoint} após ${timeout}ms`, {
          endpoint,
          timeout,
          attempt: this.metrics.endpointMetrics[endpoint].totalRequests,
        });
      }
      throw error;
    }
  }

  /**
   * Atualiza tempo médio de resposta
   */
  private updateResponseTime(endpoint: string, responseTime: number): void {
    const endpointMetrics = this.metrics.endpointMetrics[endpoint];

    if (!endpointMetrics) {
      return;
    }

    const totalRequests = endpointMetrics.totalRequests;

    // Calcular nova média
    endpointMetrics.averageResponseTime =
      (endpointMetrics.averageResponseTime * (totalRequests - 1) + responseTime) / totalRequests;

    // Atualizar média global
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) /
      this.metrics.totalRequests;
  }

  /**
   * Configura timeout específico para endpoint
   */
  setEndpointTimeout(endpoint: string, timeout: number): void {
    this.timeoutsByEndpoint.set(endpoint, timeout);
  }

  /**
   * Remove timeout específico para endpoint
   */
  removeEndpointTimeout(endpoint: string): void {
    this.timeoutsByEndpoint.delete(endpoint);
  }

  /**
   * Cancela todos os timeouts ativos
   */
  cancelAll(): void {
    this.activeTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.activeTimeouts.clear();
  }

  /**
   * Retorna métricas de timeout
   */
  getMetrics(): TimeoutMetrics {
    return {
      ...this.metrics,
      endpointMetrics: { ...this.metrics.endpointMetrics },
    };
  }

  /**
   * Reseta métricas
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      timeouts: 0,
      timeoutRate: 0,
      averageResponseTime: 0,
      endpointMetrics: {},
    };
  }
}

// ============================================================================
// Suporte a AbortController
// ============================================================================

/**
 * Cria AbortSignal com timeout
 */
export function createAbortableTimeout(timeoutMs: number): {
  signal: AbortSignal;
  cancel: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    cancel: () => {
      clearTimeout(timeoutId);
      controller.abort();
    },
  };
}

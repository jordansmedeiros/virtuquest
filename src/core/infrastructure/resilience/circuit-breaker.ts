/**
 * Circuit Breaker para proteger contra falhas em cascata
 * @module core/infrastructure/resilience/circuit-breaker
 */

import { CircuitBreakerOpenError } from '../n8n/errors';

// ============================================================================
// Enums e Interfaces
// ============================================================================

/**
 * Estados do Circuit Breaker
 */
export enum CircuitState {
  /** Funcionamento normal, requisições passam */
  CLOSED = 'CLOSED',
  /** Circuito aberto, requisições bloqueadas */
  OPEN = 'OPEN',
  /** Teste de recuperação, tentativas limitadas */
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  /** Número de falhas consecutivas para abrir circuito */
  failureThreshold: number;
  /** Tempo em ms para tentar fechar circuito */
  resetTimeout: number;
  /** Tentativas permitidas em HALF_OPEN */
  halfOpenMaxAttempts: number;
  /** Janela de tempo para contar falhas em ms */
  monitoringWindow: number;
  /** Callback executado quando estado muda */
  onStateChange?: (
    oldState: CircuitState,
    newState: CircuitState,
    error?: Error
  ) => void;
}

export interface CircuitBreakerMetrics {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: string | null;
  nextAttemptTime: string | null;
  stateTransitions: Array<{
    from: CircuitState;
    to: CircuitState;
    timestamp: string;
    reason?: string;
  }>;
}

// ============================================================================
// Configuração Padrão
// ============================================================================

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minuto
  halfOpenMaxAttempts: 3,
  monitoringWindow: 60000, // 1 minuto
};

// ============================================================================
// Classe CircuitBreaker
// ============================================================================

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number | null = null;
  private nextAttemptTime: number | null = null;
  private halfOpenAttempts: number = 0;

  private stateTransitions: CircuitBreakerMetrics['stateTransitions'] = [];

  constructor(
    private name: string,
    private config: CircuitBreakerConfig = DEFAULT_CONFIG
  ) {}

  /**
   * Executa função com circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Verificar estado atual
    if (this.state === CircuitState.OPEN) {
      // Verificar se resetTimeout passou
      if (
        this.nextAttemptTime &&
        Date.now() >= this.nextAttemptTime
      ) {
        this.transitionTo(CircuitState.HALF_OPEN, 'Reset timeout elapsed');
      } else {
        throw new CircuitBreakerOpenError(
          this.name,
          this.nextAttemptTime ? new Date(this.nextAttemptTime).toISOString() : 'unknown'
        );
      }
    }

    if (this.state === CircuitState.HALF_OPEN) {
      // Verificar se atingiu limite de tentativas
      if (this.halfOpenAttempts >= this.config.halfOpenMaxAttempts) {
        this.transitionTo(CircuitState.OPEN, 'Half-open max attempts exceeded');
        throw new CircuitBreakerOpenError(
          this.name,
          this.nextAttemptTime ? new Date(this.nextAttemptTime).toISOString() : 'unknown'
        );
      }
      this.halfOpenAttempts++;
    }

    // Executar função
    try {
      const result = await fn();

      // Sucesso
      this.onSuccess();
      return result;
    } catch (error) {
      // Falha
      this.onFailure(error as Error);
      throw error;
    }
  }

  /**
   * Tratamento de sucesso
   */
  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;

      // Se atingiu número de sucessos, fechar circuito
      if (this.successCount >= this.config.halfOpenMaxAttempts) {
        this.transitionTo(CircuitState.CLOSED, 'Sufficient successful attempts');
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Resetar contador de falhas
      this.failureCount = 0;
    }
  }

  /**
   * Tratamento de falha
   */
  private onFailure(error: Error): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      // Falha em HALF_OPEN, abrir circuito novamente
      this.transitionTo(CircuitState.OPEN, `Failure in half-open state: ${error.message}`);
    } else if (this.state === CircuitState.CLOSED) {
      // Verificar se atingiu threshold
      if (this.failureCount >= this.config.failureThreshold) {
        this.transitionTo(CircuitState.OPEN, `Failure threshold reached: ${this.failureCount}`);
      }
    }
  }

  /**
   * Transição de estado
   */
  private transitionTo(newState: CircuitState, reason?: string): void {
    const oldState = this.state;

    // Atualizar estado
    this.state = newState;

    // Registrar transição
    this.stateTransitions.push({
      from: oldState,
      to: newState,
      timestamp: new Date().toISOString(),
      reason,
    });

    // Resetar contadores conforme estado
    if (newState === CircuitState.OPEN) {
      this.nextAttemptTime = Date.now() + this.config.resetTimeout;
      this.successCount = 0;
      this.halfOpenAttempts = 0;
    } else if (newState === CircuitState.HALF_OPEN) {
      this.successCount = 0;
      this.halfOpenAttempts = 0;
    } else if (newState === CircuitState.CLOSED) {
      this.failureCount = 0;
      this.successCount = 0;
      this.halfOpenAttempts = 0;
      this.nextAttemptTime = null;
    }

    // Executar callback
    this.config.onStateChange?.(oldState, newState);
  }

  /**
   * Força reset do circuit breaker
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
    this.halfOpenAttempts = 0;
  }

  /**
   * Retorna métricas do circuit breaker
   */
  getMetrics(): CircuitBreakerMetrics {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime
        ? new Date(this.lastFailureTime).toISOString()
        : null,
      nextAttemptTime: this.nextAttemptTime
        ? new Date(this.nextAttemptTime).toISOString()
        : null,
      stateTransitions: [...this.stateTransitions],
    };
  }

  /**
   * Retorna estado atual
   */
  getState(): CircuitState {
    return this.state;
  }
}

// ============================================================================
// Classe CircuitBreakerManager
// ============================================================================

/**
 * Gerenciador de múltiplos circuit breakers (um por endpoint)
 */
export class CircuitBreakerManager {
  private breakers: Map<string, CircuitBreaker> = new Map();

  constructor(private config: CircuitBreakerConfig = DEFAULT_CONFIG) {}

  /**
   * Obtém circuit breaker para endpoint
   */
  getBreaker(endpoint: string): CircuitBreaker {
    if (!this.breakers.has(endpoint)) {
      this.breakers.set(endpoint, new CircuitBreaker(endpoint, this.config));
    }
    return this.breakers.get(endpoint)!;
  }

  /**
   * Reseta todos os circuit breakers
   */
  resetAll(): void {
    this.breakers.forEach((breaker) => breaker.reset());
  }

  /**
   * Retorna métricas de todos os circuit breakers
   */
  getMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};
    this.breakers.forEach((breaker, endpoint) => {
      metrics[endpoint] = breaker.getMetrics();
    });
    return metrics;
  }

  /**
   * Remove circuit breaker para endpoint
   */
  removeBreaker(endpoint: string): void {
    this.breakers.delete(endpoint);
  }
}

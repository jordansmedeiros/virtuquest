/**
 * Estratégia de retry exponencial com backoff
 * @module core/infrastructure/resilience/retry
 */

import { isRetryableError, RetryExhaustedError, type N8NError } from '../n8n/errors';

// ============================================================================
// Interfaces
// ============================================================================

export interface RetryConfig {
  /** Número máximo de tentativas */
  maxRetries: number;
  /** Delay inicial em ms */
  initialDelay: number;
  /** Delay máximo em ms */
  maxDelay: number;
  /** Multiplicador para backoff exponencial */
  backoffMultiplier: number;
  /** Códigos de erro que permitem retry */
  retryableErrors?: string[];
  /** Callback executado antes de cada retry */
  onRetry?: (attempt: number, error: Error, delay: number) => void;
}

export interface RetryMetrics {
  totalAttempts: number;
  successfulRetries: number;
  failedRetries: number;
  averageDelay: number;
}

// ============================================================================
// Configuração Padrão
// ============================================================================

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

// ============================================================================
// Funções de Cálculo
// ============================================================================

/**
 * Calcula delay exponencial com jitter
 * @param attempt - Número da tentativa (0-indexed)
 * @param config - Configuração de retry
 * @returns Delay em milissegundos
 */
export function calculateDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay =
    config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelay);

  // Adicionar jitter aleatório (±10%) para evitar thundering herd
  const jitter = cappedDelay * 0.1 * (Math.random() * 2 - 1);
  return Math.floor(cappedDelay + jitter);
}

/**
 * Determina se erro permite retry
 * @param error - Erro ocorrido
 * @param config - Configuração de retry
 * @returns true se erro permite retry
 */
export function shouldRetry(error: Error, config: RetryConfig): boolean {
  // Verificar se é N8NError e se é retryable
  if ('code' in error && 'statusCode' in error) {
    const n8nError = error as N8NError;
    return isRetryableError(n8nError);
  }

  // Verificar erros customizados na config
  if (config.retryableErrors && 'code' in error) {
    return config.retryableErrors.includes((error as { code: string }).code);
  }

  // Erros de rede são retryable por padrão
  if (
    error.message.includes('timeout') ||
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ENOTFOUND') ||
    error.message.includes('network')
  ) {
    return true;
  }

  return false;
}

// ============================================================================
// Função withRetry
// ============================================================================

/**
 * Wrapper genérico para adicionar retry a funções assíncronas
 * @param fn - Função a ser executada com retry
 * @param config - Configuração de retry
 * @returns Resultado da função
 * @throws RetryExhaustedError se todas as tentativas falharem
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  const errors: Error[] = [];
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      // Executar função
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error as Error;
      errors.push(lastError);

      // Verificar se deve fazer retry
      const canRetry = shouldRetry(lastError, finalConfig);
      const hasRetriesLeft = attempt < finalConfig.maxRetries;

      if (!canRetry || !hasRetriesLeft) {
        // Não pode fazer retry ou esgotou tentativas
        if (hasRetriesLeft && !canRetry) {
          // Erro não é retryable, lançar imediatamente
          throw lastError;
        }
        break;
      }

      // Calcular delay e executar callback
      const delay = calculateDelay(attempt, finalConfig);
      finalConfig.onRetry?.(attempt + 1, lastError, delay);

      // Aguardar delay
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Todas as tentativas falharam
  throw new RetryExhaustedError(finalConfig.maxRetries + 1, errors);
}

// ============================================================================
// Classe RetryPolicy
// ============================================================================

/**
 * Classe para gerenciar política de retry com histórico
 */
export class RetryPolicy {
  private attemptHistory: Array<{
    attempt: number;
    timestamp: string;
    error?: Error;
    delay?: number;
  }> = [];

  private metrics: RetryMetrics = {
    totalAttempts: 0,
    successfulRetries: 0,
    failedRetries: 0,
    averageDelay: 0,
  };

  constructor(private config: RetryConfig = DEFAULT_RETRY_CONFIG) {}

  /**
   * Executa função com retry policy
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return withRetry(fn, {
      ...this.config,
      onRetry: (attempt, error, delay) => {
        // Registrar tentativa
        this.attemptHistory.push({
          attempt,
          timestamp: new Date().toISOString(),
          error,
          delay,
        });

        // Atualizar métricas
        this.metrics.totalAttempts++;
        this.metrics.averageDelay =
          (this.metrics.averageDelay * (this.metrics.totalAttempts - 1) + delay) /
          this.metrics.totalAttempts;

        // Executar callback customizado
        this.config.onRetry?.(attempt, error, delay);
      },
    })
      .then((result) => {
        // Sucesso (com ou sem retries)
        if (this.attemptHistory.length > 0) {
          this.metrics.successfulRetries++;
        }
        return result;
      })
      .catch((error) => {
        // Falha após retries
        if (this.attemptHistory.length > 0) {
          this.metrics.failedRetries++;
        }
        throw error;
      });
  }

  /**
   * Reseta histórico de tentativas
   */
  reset(): void {
    this.attemptHistory = [];
  }

  /**
   * Retorna métricas de retry
   */
  getMetrics(): RetryMetrics & { history: typeof this.attemptHistory } {
    return {
      ...this.metrics,
      history: [...this.attemptHistory],
    };
  }

  /**
   * Atualiza configuração de retry
   */
  updateConfig(config: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Hierarquia de erros customizados para integração N8N
 * @module core/infrastructure/n8n/errors
 */

// ============================================================================
// Classe Base N8NError
// ============================================================================

export class N8NError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'N8NError';
    this.timestamp = new Date().toISOString();

    // Mantém stack trace correto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public readonly timestamp: string;

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }

  isPedagogicalError(): boolean {
    return (
      this instanceof PedagogicalAlignmentError ||
      this instanceof CompetencyNotFoundError ||
      this instanceof InvalidBloomLevelError ||
      this instanceof PlanApprovalError ||
      this instanceof CurriculumGapError
    );
  }
}

// ============================================================================
// Erros de Rede
// ============================================================================

export class NetworkError extends N8NError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('NETWORK_ERROR', message, undefined, details);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends N8NError {
  constructor(message: string, timeoutMs: number) {
    super('TIMEOUT_ERROR', message, 408, { timeoutMs });
    this.name = 'TimeoutError';
  }
}

export class ConnectionRefusedError extends N8NError {
  constructor(message: string = 'N8N indisponível') {
    super('CONNECTION_REFUSED', message, 503);
    this.name = 'ConnectionRefusedError';
  }
}

// ============================================================================
// Erros de Autenticação
// ============================================================================

export class AuthenticationError extends N8NError {
  constructor(message: string = 'API key inválida ou ausente') {
    super('AUTHENTICATION_ERROR', message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends N8NError {
  constructor(message: string = 'Usuário sem permissão para esta operação') {
    super('AUTHORIZATION_ERROR', message, 403);
    this.name = 'AuthorizationError';
  }
}

// ============================================================================
// Erros de Validação
// ============================================================================

export class ValidationError extends N8NError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class SchemaValidationError extends N8NError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('SCHEMA_VALIDATION_ERROR', message, 422, details);
    this.name = 'SchemaValidationError';
  }
}

// ============================================================================
// Erros Pedagógicos (Domínio)
// ============================================================================

export class PedagogicalAlignmentError extends N8NError {
  constructor(message: string, gaps: string[]) {
    super('PEDAGOGICAL_ALIGNMENT_ERROR', message, 422, { gaps });
    this.name = 'PedagogicalAlignmentError';
  }
}

export class CompetencyNotFoundError extends N8NError {
  constructor(competencyCode: string) {
    super(
      'COMPETENCY_NOT_FOUND',
      `Competência BNCC '${competencyCode}' não encontrada no catálogo`,
      404,
      { competencyCode }
    );
    this.name = 'CompetencyNotFoundError';
  }
}

export class InvalidBloomLevelError extends N8NError {
  constructor(level: string, context?: string) {
    super(
      'INVALID_BLOOM_LEVEL',
      `Nível Bloom '${level}' inválido para o contexto${context ? `: ${context}` : ''}`,
      400,
      { level, context }
    );
    this.name = 'InvalidBloomLevelError';
  }
}

export class PlanApprovalError extends N8NError {
  constructor(message: string, planId: string) {
    super('PLAN_APPROVAL_ERROR', message, 422, { planId });
    this.name = 'PlanApprovalError';
  }
}

export class CurriculumGapError extends N8NError {
  constructor(message: string, gaps: string[]) {
    super('CURRICULUM_GAP_ERROR', message, 422, { gaps });
    this.name = 'CurriculumGapError';
  }
}

// ============================================================================
// Erros de Resiliência
// ============================================================================

export class CircuitBreakerOpenError extends N8NError {
  constructor(endpoint: string, nextAttemptTime: string) {
    super(
      'CIRCUIT_BREAKER_OPEN',
      `Circuit breaker aberto para ${endpoint}. Próxima tentativa: ${nextAttemptTime}`,
      503,
      { endpoint, nextAttemptTime }
    );
    this.name = 'CircuitBreakerOpenError';
  }
}

export class RetryExhaustedError extends N8NError {
  constructor(attempts: number, errors: Error[]) {
    super(
      'RETRY_EXHAUSTED',
      `Todas as ${attempts} tentativas de retry falharam`,
      503,
      { attempts, errors: errors.map((e) => e.message) }
    );
    this.name = 'RetryExhaustedError';
  }
}

// ============================================================================
// Mapeamento de Códigos
// ============================================================================

const ERROR_CODE_MAP: Record<
  number,
  { errorClass: typeof N8NError; defaultMessage: string }
> = {
  400: { errorClass: ValidationError, defaultMessage: 'Dados de entrada inválidos' },
  401: {
    errorClass: AuthenticationError,
    defaultMessage: 'Autenticação necessária',
  },
  403: {
    errorClass: AuthorizationError,
    defaultMessage: 'Sem permissão para esta operação',
  },
  404: {
    errorClass: CompetencyNotFoundError,
    defaultMessage: 'Recurso não encontrado',
  },
  408: { errorClass: TimeoutError, defaultMessage: 'Requisição excedeu tempo limite' },
  422: {
    errorClass: SchemaValidationError,
    defaultMessage: 'Dados não conformes com schema',
  },
  503: {
    errorClass: ConnectionRefusedError,
    defaultMessage: 'Serviço temporariamente indisponível',
  },
};

// ============================================================================
// Tradutor de Erros
// ============================================================================

/**
 * Traduz erros HTTP/N8N para erros pedagógicos customizados
 * @param error - Erro original
 * @returns Erro N8N traduzido
 */
export function translateN8NError(error: unknown): N8NError {
  // Se já é um N8NError, retornar diretamente
  if (error instanceof N8NError) {
    return error;
  }

  // Tratar erros de fetch/HTTP
  if (error instanceof Error) {
    // Timeout
    if (error.message.includes('timeout')) {
      return new TimeoutError(error.message, 30000);
    }

    // Connection refused
    if (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('fetch failed')
    ) {
      return new ConnectionRefusedError();
    }

    // Erro genérico de rede
    if (
      error.message.includes('network') ||
      error.message.includes('ENOTFOUND')
    ) {
      return new NetworkError(error.message);
    }
  }

  // Tratar respostas HTTP com status code
  if (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
  ) {
    const statusCode = error.statusCode;
    const errorMapping = ERROR_CODE_MAP[statusCode];

    if (errorMapping) {
      const message =
        'message' in error && typeof error.message === 'string'
          ? error.message
          : errorMapping.defaultMessage;

      // Tratar erros pedagógicos específicos
      if ('code' in error && typeof error.code === 'string') {
        switch (error.code) {
          case 'invalid_competency':
            return new CompetencyNotFoundError(
              ('competencyCode' in error &&
              typeof error.competencyCode === 'string'
                ? error.competencyCode
                : 'unknown') as string
            );

          case 'alignment_failed':
            return new PedagogicalAlignmentError(
              message,
              'gaps' in error && Array.isArray(error.gaps)
                ? error.gaps
                : ([] as string[])
            );

          case 'curriculum_gap':
            return new CurriculumGapError(
              message,
              'gaps' in error && Array.isArray(error.gaps)
                ? error.gaps
                : ([] as string[])
            );

          case 'invalid_bloom_level':
            return new InvalidBloomLevelError(
              ('level' in error && typeof error.level === 'string'
                ? error.level
                : 'unknown') as string
            );

          case 'plan_approval_failed':
            return new PlanApprovalError(
              message,
              ('planId' in error && typeof error.planId === 'string'
                ? error.planId
                : 'unknown') as string
            );
        }
      }

      // Instanciar erro mapeado
      return new errorMapping.errorClass(message);
    }
  }

  // Erro desconhecido
  return new N8NError(
    'UNKNOWN_ERROR',
    error instanceof Error ? error.message : 'Erro desconhecido',
    500,
    { originalError: error }
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determina se erro permite retry
 * @param error - Erro a ser verificado
 * @returns true se erro é retryable
 */
export function isRetryableError(error: N8NError): boolean {
  const retryableCodes = [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'CONNECTION_REFUSED',
  ];
  return (
    retryableCodes.includes(error.code) ||
    (error.statusCode !== undefined &&
      [408, 429, 500, 502, 503, 504].includes(error.statusCode))
  );
}

/**
 * Determina severidade do erro
 * @param error - Erro a ser verificado
 * @returns Nível de severidade
 */
export function getErrorSeverity(
  error: N8NError
): 'low' | 'medium' | 'high' | 'critical' {
  if (error instanceof ValidationError || error instanceof InvalidBloomLevelError) {
    return 'low';
  }

  if (
    error.isPedagogicalError() ||
    error instanceof SchemaValidationError
  ) {
    return 'medium';
  }

  if (
    error instanceof AuthenticationError ||
    error instanceof AuthorizationError
  ) {
    return 'high';
  }

  if (
    error instanceof CircuitBreakerOpenError ||
    error instanceof RetryExhaustedError
  ) {
    return 'critical';
  }

  return 'medium';
}

/**
 * Formata erro para exibição ao usuário
 * @param error - Erro a ser formatado
 * @returns Mensagem amigável
 */
export function formatErrorForUser(error: N8NError): string {
  if (error.isPedagogicalError()) {
    return error.message;
  }

  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
  }

  if (error instanceof CircuitBreakerOpenError) {
    return 'O serviço está temporariamente indisponível. Por favor, aguarde alguns instantes.';
  }

  if (error instanceof AuthenticationError) {
    return 'Falha na autenticação. Por favor, faça login novamente.';
  }

  if (error instanceof AuthorizationError) {
    return 'Você não tem permissão para realizar esta operação.';
  }

  return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}

/**
 * Loga erro com contexto estruturado
 * @param error - Erro a ser logado
 * @param context - Contexto adicional
 */
export function logError(error: N8NError, context?: Record<string, unknown>): void {
  const severity = getErrorSeverity(error);
  const logData = {
    ...error.toJSON(),
    severity,
    context,
  };

  if (severity === 'critical' || severity === 'high') {
    console.error('[N8N Error]', logData);
  } else {
    console.warn('[N8N Error]', logData);
  }
}

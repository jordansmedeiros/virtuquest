/**
 * Cliente HTTP tipado para integração N8N
 * @module core/infrastructure/n8n/client
 */

import { env } from '@/lib/env';
import { N8N_ENDPOINTS, buildEndpointURL } from './endpoints';
import { translateN8NError, logError } from './errors';
import { RetryPolicy, withRetry, type RetryConfig } from '../resilience/retry';
import { CircuitBreakerManager, type CircuitBreakerConfig } from '../resilience/circuit-breaker';
import { TimeoutManager } from '../resilience/timeout';
import { EducationalCatalogCache } from '../cache/catalog-cache';
import type {
  N8NResponse,
  CreateUserRequest,
  CreateUserResponse,
  AuthUserRequest,
  AuthUserResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  SessionUser,
  UpdateUserRequest,
  Usuario,
  ListUsersRequest,
  ListUsersResponse,
  CreatePlanRequest,
  CreatePlanResponse,
  UpdatePlanRequest,
  PlanoAula,
  ApprovePlanRequest,
  ApprovePlanResponse,
  QueryPlansRequest,
  QueryPlansResponse,
  SuggestContentRequest,
  SuggestContentResponse,
  AnalyzeAlignmentRequest,
  AnalyzeAlignmentResponse,
  GenerateAssessmentRequest,
  GenerateAssessmentResponse,
  BNCCProgressRequest,
  BNCCProgressResponse,
  VirtuesDevelopmentRequest,
  VirtuesDevelopmentResponse,
  PedagogicalEventRequest,
  PedagogicalEventResponse,
  CatalogoBNCC,
  CatalogoBloom,
  CatalogoVirtudes,
} from './types';

// ============================================================================
// Interfaces
// ============================================================================

export interface N8NClientConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
  retryConfig: RetryConfig;
  circuitBreakerConfig: CircuitBreakerConfig;
  enableLogging: boolean;
  enableTelemetry: boolean;
}

export interface RequestOptions {
  timeout?: number;
  retryConfig?: Partial<RetryConfig>;
  headers?: Record<string, string>;
  skipCircuitBreaker?: boolean;
}

export interface N8NClientMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
  averageResponseTime: number;
  retryMetrics: ReturnType<RetryPolicy['getMetrics']>;
  circuitBreakerMetrics: ReturnType<CircuitBreakerManager['getMetrics']>;
  timeoutMetrics: ReturnType<TimeoutManager['getMetrics']>;
}

type RequestInterceptor = (
  endpoint: string,
  data: unknown,
  options?: RequestOptions
) =>
  | Promise<{ endpoint: string; data: unknown; options: RequestOptions | undefined }>
  | { endpoint: string; data: unknown; options: RequestOptions | undefined };

type ResponseInterceptor = <T>(
  endpoint: string,
  response: N8NResponse<T>
) => Promise<N8NResponse<T>> | N8NResponse<T>;

// ============================================================================
// Configuração Padrão
// ============================================================================

const DEFAULT_CONFIG: N8NClientConfig = {
  baseURL: env.N8N_BASE_URL,
  apiKey: env.N8N_API_KEY ?? '',
  timeout: 30000,
  retryConfig: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },
  circuitBreakerConfig: {
    failureThreshold: 5,
    resetTimeout: 60000,
    halfOpenMaxAttempts: 3,
    monitoringWindow: 60000,
  },
  enableLogging: env.LOG_LEVEL !== 'silent' && env.LOG_LEVEL !== undefined,
  enableTelemetry: true,
};

// ============================================================================
// Classe N8NClient
// ============================================================================

export class N8NClient {
  private config: N8NClientConfig;
  private retryPolicy: RetryPolicy;
  private circuitBreakerManager: CircuitBreakerManager;
  private timeoutManager: TimeoutManager;
  private catalogCache: EducationalCatalogCache;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  private metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    responseTimes: [] as number[],
  };

  constructor(config?: Partial<N8NClientConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Inicializar componentes de resiliência
    this.retryPolicy = new RetryPolicy(this.config.retryConfig);
    this.circuitBreakerManager = new CircuitBreakerManager(this.config.circuitBreakerConfig);
    this.timeoutManager = new TimeoutManager(this.config.timeout);

    // Inicializar cache de catálogos
    this.catalogCache = new EducationalCatalogCache({
      bncc: env.CACHE_TTL_BNCC,
      bloom: env.CACHE_TTL_BLOOM,
      virtues: env.CACHE_TTL_VIRTUDES,
    });

    // Configurar interceptadores padrão
    this.setupDefaultInterceptors();
  }

  /**
   * Configurar interceptadores padrão
   */
  private setupDefaultInterceptors(): void {
    // Logging interceptor
    if (this.config.enableLogging) {
      this.addRequestInterceptor((endpoint, data, options) => {
        console.log(`[N8NClient] Request to ${endpoint}`, { data, options });
        return { endpoint, data, options };
      });

      this.addResponseInterceptor((endpoint, response) => {
        console.log(`[N8NClient] Response from ${endpoint}`, { response });
        return response;
      });
    }
  }

  /**
   * Método público para executar requisições arbitrárias
   * @public
   */
  async execute<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    options?: RequestOptions
  ): Promise<TResponse> {
    const response = await this.request<TRequest, TResponse>(endpoint, data, options);
    return response.data;
  }

  /**
   * Método privado para fazer requisições
   */
  private async request<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    options?: RequestOptions
  ): Promise<N8NResponse<TResponse>> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      // 1. Aplicar interceptadores de request
      let interceptedData: {
        endpoint: string;
        data: TRequest;
        options: RequestOptions | undefined;
      } = {
        endpoint,
        data,
        options,
      };
      for (const interceptor of this.requestInterceptors) {
        const result = await interceptor(
          interceptedData.endpoint,
          interceptedData.data,
          interceptedData.options
        );
        interceptedData = {
          endpoint: result.endpoint,
          data: result.data as TRequest,
          options: result.options,
        };
      }

      // 2. Construir URL e headers
      const url = buildEndpointURL(this.config.baseURL, endpoint);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        ...options?.headers,
      };

      // 3. Obter circuit breaker para endpoint
      const circuitBreaker = this.circuitBreakerManager.getBreaker(endpoint);

      // 4. Executar com circuit breaker
      const executeRequest = async () => {
        // Executar com timeout
        return await this.timeoutManager.execute(
          async () => {
            // Executar com retry (usar config customizado se fornecido)
            const retryFn = async () => {
              const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(interceptedData.data),
              });

              // Verificar status HTTP
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw translateN8NError({
                  statusCode: response.status,
                  message: errorData.message || response.statusText,
                  code: errorData.code,
                  ...errorData,
                });
              }

              // Parsear resposta
              const jsonResponse = (await response.json()) as N8NResponse<TResponse>;
              return jsonResponse;
            };

            // Se retryConfig customizado foi fornecido, usar withRetry diretamente
            if (options?.retryConfig) {
              return await withRetry(retryFn, {
                ...this.config.retryConfig,
                ...options.retryConfig,
              });
            }

            // Caso contrário, usar retry policy padrão
            return await this.retryPolicy.execute(retryFn);
          },
          endpoint,
          options?.timeout
        );
      };

      // Executar com ou sem circuit breaker
      let response: N8NResponse<TResponse>;
      if (options?.skipCircuitBreaker) {
        response = await executeRequest();
      } else {
        response = await circuitBreaker.execute(executeRequest);
      }

      // 5. Aplicar interceptadores de response
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(endpoint, response);
      }

      // 6. Atualizar métricas
      this.metrics.successfulRequests++;
      this.metrics.responseTimes.push(Date.now() - startTime);

      return response;
    } catch (error) {
      // Tratar erro
      const n8nError = translateN8NError(error);

      // Logar erro
      if (this.config.enableLogging) {
        logError(n8nError, { endpoint, data });
      }

      // Atualizar métricas
      this.metrics.failedRequests++;

      // Emitir telemetria (se habilitado)
      if (this.config.enableTelemetry) {
        // TODO: Integrar com sistema de telemetria
      }

      throw n8nError;
    }
  }

  // ========================================================================
  // Métodos Públicos - Usuários
  // ========================================================================

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await this.request<CreateUserRequest, CreateUserResponse>(
      N8N_ENDPOINTS.usuarios.criar,
      data
    );
    return response.data;
  }

  async authenticateUser(data: AuthUserRequest): Promise<AuthUserResponse> {
    const response = await this.request<AuthUserRequest, AuthUserResponse>(
      N8N_ENDPOINTS.usuarios.autenticar,
      data
    );
    return response.data;
  }

  async updateUser(data: UpdateUserRequest): Promise<Usuario> {
    const response = await this.request<UpdateUserRequest, Usuario>(
      N8N_ENDPOINTS.usuarios.atualizar,
      data
    );
    return response.data;
  }

  async listUsers(data: ListUsersRequest): Promise<ListUsersResponse> {
    const response = await this.request<ListUsersRequest, ListUsersResponse>(
      N8N_ENDPOINTS.usuarios.listar,
      data
    );
    return response.data;
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await this.request<RefreshTokenRequest, RefreshTokenResponse>(
      N8N_ENDPOINTS.usuarios.refresh,
      data
    );
    return response.data;
  }

  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    const response = await this.request<LogoutRequest, LogoutResponse>(
      N8N_ENDPOINTS.usuarios.logout,
      data
    );
    return response.data;
  }

  async getCurrentUser(): Promise<SessionUser> {
    const response = await this.request<void, SessionUser>(
      N8N_ENDPOINTS.usuarios.me,
      undefined as unknown as void
    );
    return response.data;
  }

  // ========================================================================
  // Métodos Públicos - Planejamento
  // ========================================================================

  async createPlan(data: CreatePlanRequest): Promise<CreatePlanResponse> {
    const response = await this.request<CreatePlanRequest, CreatePlanResponse>(
      N8N_ENDPOINTS.planejamento.criarPlano,
      data
    );
    return response.data;
  }

  async updatePlan(data: UpdatePlanRequest): Promise<PlanoAula> {
    const response = await this.request<UpdatePlanRequest, PlanoAula>(
      N8N_ENDPOINTS.planejamento.atualizarPlano,
      data
    );
    return response.data;
  }

  async approvePlan(data: ApprovePlanRequest): Promise<ApprovePlanResponse> {
    const response = await this.request<ApprovePlanRequest, ApprovePlanResponse>(
      N8N_ENDPOINTS.planejamento.aprovarPlano,
      data
    );
    return response.data;
  }

  async queryPlans(data: QueryPlansRequest): Promise<QueryPlansResponse> {
    const response = await this.request<QueryPlansRequest, QueryPlansResponse>(
      N8N_ENDPOINTS.planejamento.consultarPlanos,
      data
    );
    return response.data;
  }

  async getPlanById(id: string): Promise<PlanoAula> {
    const response = await this.request<{ id: string }, PlanoAula>(
      N8N_ENDPOINTS.planejamento.buscarPorId,
      { id }
    );
    return response.data;
  }

  async deletePlan(id: string): Promise<void> {
    await this.request<{ id: string }, void>(N8N_ENDPOINTS.planejamento.deletarPlano, { id });
  }

  // ========================================================================
  // Métodos Públicos - IA
  // ========================================================================

  async suggestContent(data: SuggestContentRequest): Promise<SuggestContentResponse> {
    const response = await this.request<SuggestContentRequest, SuggestContentResponse>(
      N8N_ENDPOINTS.ia.sugerirConteudo,
      data
    );
    return response.data;
  }

  async analyzeAlignment(data: AnalyzeAlignmentRequest): Promise<AnalyzeAlignmentResponse> {
    const response = await this.request<AnalyzeAlignmentRequest, AnalyzeAlignmentResponse>(
      N8N_ENDPOINTS.ia.analisarAlinhamento,
      data
    );
    return response.data;
  }

  async generateAssessment(data: GenerateAssessmentRequest): Promise<GenerateAssessmentResponse> {
    const response = await this.request<GenerateAssessmentRequest, GenerateAssessmentResponse>(
      N8N_ENDPOINTS.ia.gerarAvaliacao,
      data
    );
    return response.data;
  }

  // ========================================================================
  // Métodos Públicos - Relatórios
  // ========================================================================

  async getBNCCProgress(data: BNCCProgressRequest): Promise<BNCCProgressResponse> {
    const response = await this.request<BNCCProgressRequest, BNCCProgressResponse>(
      N8N_ENDPOINTS.relatorios.progressoBNCC,
      data
    );
    return response.data;
  }

  async getVirtuesDevelopment(
    data: VirtuesDevelopmentRequest
  ): Promise<VirtuesDevelopmentResponse> {
    const response = await this.request<VirtuesDevelopmentRequest, VirtuesDevelopmentResponse>(
      N8N_ENDPOINTS.relatorios.desenvolvimentoVirtudes,
      data
    );
    return response.data;
  }

  // ========================================================================
  // Métodos Públicos - Telemetria
  // ========================================================================

  async recordPedagogicalEvent(data: PedagogicalEventRequest): Promise<PedagogicalEventResponse> {
    const response = await this.request<PedagogicalEventRequest, PedagogicalEventResponse>(
      N8N_ENDPOINTS.telemetria.registrarEvento,
      data
    );
    return response.data;
  }

  // ========================================================================
  // Métodos Públicos - Catálogos
  // ========================================================================

  async fetchBNCCCatalog(): Promise<CatalogoBNCC> {
    // Verificar cache primeiro
    const cached = this.catalogCache.getBNCC();
    if (cached) {
      return cached;
    }

    // Cache miss, buscar do N8N
    const response = await this.request<void, CatalogoBNCC>(
      N8N_ENDPOINTS.catalogos.buscarBNCC,
      undefined as unknown as void
    );

    // Cachear resposta usando setter público
    this.catalogCache.setBNCCCatalog(response.data);

    return response.data;
  }

  async fetchBloomCatalog(): Promise<CatalogoBloom> {
    // Verificar cache primeiro
    const cached = this.catalogCache.getBloom();
    if (cached) {
      return cached;
    }

    // Cache miss, buscar do N8N
    const response = await this.request<void, CatalogoBloom>(
      N8N_ENDPOINTS.catalogos.buscarBloom,
      undefined as unknown as void
    );

    // Cachear resposta usando setter público
    this.catalogCache.setBloomCatalog(response.data);

    return response.data;
  }

  async fetchVirtuesCatalog(): Promise<CatalogoVirtudes> {
    // Verificar cache primeiro
    const cached = this.catalogCache.getVirtues();
    if (cached) {
      return cached;
    }

    // Cache miss, buscar do N8N
    const response = await this.request<void, CatalogoVirtudes>(
      N8N_ENDPOINTS.catalogos.buscarVirtudes,
      undefined as unknown as void
    );

    // Cachear resposta usando setter público
    this.catalogCache.setVirtuesCatalog(response.data);

    return response.data;
  }

  /**
   * Hidrata cache de catálogos com dados do N8N
   */
  async hydrateCatalogs(): Promise<void> {
    await this.catalogCache.hydrate({
      fetchBNCC: async () => {
        const response = await this.request<void, CatalogoBNCC>(
          N8N_ENDPOINTS.catalogos.buscarBNCC,
          undefined as unknown as void
        );
        return response.data;
      },
      fetchBloom: async () => {
        const response = await this.request<void, CatalogoBloom>(
          N8N_ENDPOINTS.catalogos.buscarBloom,
          undefined as unknown as void
        );
        return response.data;
      },
      fetchVirtues: async () => {
        const response = await this.request<void, CatalogoVirtudes>(
          N8N_ENDPOINTS.catalogos.buscarVirtudes,
          undefined as unknown as void
        );
        return response.data;
      },
    });
  }

  /**
   * Invalida cache de catálogos
   */
  invalidateCatalogs(): void {
    this.catalogCache.invalidateCatalogs();
  }

  /**
   * Invalida apenas catálogo BNCC
   */
  invalidateBNCCCatalog(): void {
    this.catalogCache.invalidateBNCC();
  }

  /**
   * Invalida apenas catálogo Bloom
   */
  invalidateBloomCatalog(): void {
    this.catalogCache.invalidateBloom();
  }

  /**
   * Invalida apenas catálogo Virtudes
   */
  invalidateVirtuesCatalog(): void {
    this.catalogCache.invalidateVirtues();
  }

  /**
   * Verifica se catálogos estão cacheados
   */
  isCatalogsHydrated(): boolean {
    return this.catalogCache.isHydrated();
  }

  // ========================================================================
  // Métodos de Configuração
  // ========================================================================

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  getMetrics(): N8NClientMetrics {
    const totalRequests = this.metrics.totalRequests;
    const successRate = totalRequests > 0 ? this.metrics.successfulRequests / totalRequests : 0;
    const averageResponseTime =
      this.metrics.responseTimes.length > 0
        ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length
        : 0;

    return {
      totalRequests,
      successfulRequests: this.metrics.successfulRequests,
      failedRequests: this.metrics.failedRequests,
      successRate,
      averageResponseTime,
      retryMetrics: this.retryPolicy.getMetrics(),
      circuitBreakerMetrics: this.circuitBreakerManager.getMetrics(),
      timeoutMetrics: this.timeoutManager.getMetrics(),
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const n8nClient = new N8NClient();

// ============================================================================
// Server Actions Wrappers
// ============================================================================

/**
 * Wrapper para usar N8NClient em Server Actions
 */
export async function executeN8NWorkflow<TRequest, TResponse>(
  endpoint: string,
  data: TRequest
): Promise<TResponse> {
  'use server';

  return await n8nClient.execute<TRequest, TResponse>(endpoint, data);
}

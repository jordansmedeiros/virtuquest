/**
 * Hook React para executar workflows N8N
 * @module hooks/use-n8n-workflow
 */

'use client';

import { useState, useCallback } from 'react';
import { n8nClient, N8N_ENDPOINTS } from '@/core/infrastructure/n8n';
import type { N8NError } from '@/core/infrastructure/n8n';
import type {
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
} from '@/core/infrastructure/n8n';

// ============================================================================
// Interfaces
// ============================================================================

export interface UseN8NWorkflowOptions<TResponse> {
  /** Callback executado em sucesso */
  onSuccess?: (data: TResponse) => void;
  /** Callback executado em erro */
  onError?: (error: N8NError) => void;
  /** Configuração de retry customizada */
  retryConfig?: {
    maxRetries: number;
    initialDelay: number;
  };
  /** Habilitar cache de resposta */
  enableCache?: boolean;
  /** Chave para cache (se habilitado) */
  cacheKey?: string;
  /** Callback para atualizar Zustand store (preparação futura) */
  updateStore?: (data: TResponse) => void;
}

export interface UseN8NWorkflowResult<TRequest, TResponse> {
  /** Dados da resposta */
  data: TResponse | null;
  /** Erro ocorrido */
  error: N8NError | null;
  /** Indicador de carregamento */
  isLoading: boolean;
  /** Indicador de sucesso */
  isSuccess: boolean;
  /** Indicador de erro */
  isError: boolean;
  /** Função para executar workflow */
  execute: (requestData: TRequest) => Promise<TResponse>;
  /** Função para resetar estado */
  reset: () => void;
}

// ============================================================================
// Cache de Respostas
// ============================================================================

const responseCache = new Map<
  string,
  { data: unknown; timestamp: number }
>();

function getCachedResponse<T>(key: string): T | null {
  const cached = responseCache.get(key);
  if (!cached) return null;

  // Verificar se expirou (5 minutos)
  if (Date.now() - cached.timestamp > 300000) {
    responseCache.delete(key);
    return null;
  }

  return cached.data as T;
}

function cacheResponse(key: string, data: unknown): void {
  responseCache.set(key, { data, timestamp: Date.now() });
}

// ============================================================================
// Hook Principal
// ============================================================================

/**
 * Hook para executar workflows N8N com estados de loading/error
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { execute, isLoading, error } = useN8NWorkflow<Request, Response>(
 *     '/webhook/my-endpoint',
 *     {
 *       onSuccess: (data) => console.log('Success!', data),
 *       onError: (error) => console.error('Error!', error),
 *     }
 *   );
 *
 *   const handleSubmit = async (data: Request) => {
 *     await execute(data);
 *   };
 *
 *   return <button onClick={handleSubmit} disabled={isLoading}>Submit</button>;
 * }
 * ```
 */
export function useN8NWorkflow<TRequest, TResponse>(
  endpoint: string,
  options?: UseN8NWorkflowOptions<TResponse>
): UseN8NWorkflowResult<TRequest, TResponse> {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<N8NError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (requestData: TRequest): Promise<TResponse> => {
      // 1. Resetar estados
      setError(null);
      setIsLoading(true);

      try {
        // 2. Verificar cache se habilitado
        if (options?.enableCache && options?.cacheKey) {
          const cached = getCachedResponse<TResponse>(options.cacheKey);
          if (cached) {
            setData(cached);
            setIsLoading(false);
            options?.onSuccess?.(cached);
            return cached;
          }
        }

        // 3. Executar workflow via n8nClient
        const response = await (n8nClient as any).request<TRequest, TResponse>(
          endpoint,
          requestData,
          { retryConfig: options?.retryConfig }
        );

        const responseData = response.data;

        // 4. Armazenar resposta
        setData(responseData);

        // 5. Cachear se habilitado
        if (options?.enableCache && options?.cacheKey) {
          cacheResponse(options.cacheKey, responseData);
        }

        // 6. Atualizar store se fornecido (preparação futura)
        options?.updateStore?.(responseData);

        // 7. Executar callback de sucesso
        options?.onSuccess?.(responseData);

        return responseData;
      } catch (err) {
        // 8. Tratar erro
        const n8nError = err as N8NError;
        setError(n8nError);

        // 9. Executar callback de erro
        options?.onError?.(n8nError);

        throw n8nError;
      } finally {
        // 10. Finalizar loading
        setIsLoading(false);
      }
    },
    [endpoint, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const isSuccess = data !== null && error === null;
  const isError = error !== null;

  return {
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    execute,
    reset,
  };
}

// ============================================================================
// Hooks Especializados
// ============================================================================

/**
 * Hook para criar plano de aula
 */
export function useCreatePlan(
  options?: UseN8NWorkflowOptions<CreatePlanResponse>
) {
  return useN8NWorkflow<CreatePlanRequest, CreatePlanResponse>(
    N8N_ENDPOINTS.planejamento.criarPlano,
    options
  );
}

/**
 * Hook para atualizar plano de aula
 */
export function useUpdatePlan(options?: UseN8NWorkflowOptions<PlanoAula>) {
  return useN8NWorkflow<UpdatePlanRequest, PlanoAula>(
    N8N_ENDPOINTS.planejamento.atualizarPlano,
    options
  );
}

/**
 * Hook para aprovar plano de aula
 */
export function useApprovePlan(
  options?: UseN8NWorkflowOptions<ApprovePlanResponse>
) {
  return useN8NWorkflow<ApprovePlanRequest, ApprovePlanResponse>(
    N8N_ENDPOINTS.planejamento.aprovarPlano,
    options
  );
}

/**
 * Hook para consultar planos de aula
 */
export function useQueryPlans(
  options?: UseN8NWorkflowOptions<QueryPlansResponse>
) {
  return useN8NWorkflow<QueryPlansRequest, QueryPlansResponse>(
    N8N_ENDPOINTS.planejamento.consultarPlanos,
    options
  );
}

/**
 * Hook para sugerir conteúdo com IA
 */
export function useSuggestContent(
  options?: UseN8NWorkflowOptions<SuggestContentResponse>
) {
  return useN8NWorkflow<SuggestContentRequest, SuggestContentResponse>(
    N8N_ENDPOINTS.ia.sugerirConteudo,
    options
  );
}

/**
 * Hook para analisar alinhamento pedagógico
 */
export function useAnalyzeAlignment(
  options?: UseN8NWorkflowOptions<AnalyzeAlignmentResponse>
) {
  return useN8NWorkflow<AnalyzeAlignmentRequest, AnalyzeAlignmentResponse>(
    N8N_ENDPOINTS.ia.analisarAlinhamento,
    options
  );
}

/**
 * Hook para gerar avaliações
 */
export function useGenerateAssessment(
  options?: UseN8NWorkflowOptions<GenerateAssessmentResponse>
) {
  return useN8NWorkflow<GenerateAssessmentRequest, GenerateAssessmentResponse>(
    N8N_ENDPOINTS.ia.gerarAvaliacao,
    options
  );
}

/**
 * EXEMPLO DE USO:
 *
 * function CreatePlanForm() {
 *   const { execute, isLoading, error } = useCreatePlan({
 *     onSuccess: (plan) => {
 *       toast.success('Plano criado com sucesso!');
 *       router.push(`/planos/${plan.id}`);
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     },
 *   });
 *
 *   const handleSubmit = async (data: CreatePlanRequest) => {
 *     await execute(data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <Button type="submit" disabled={isLoading}>
 *         {isLoading ? 'Criando...' : 'Criar Plano'}
 *       </Button>
 *       {error && <ErrorMessage error={error} />}
 *     </form>
 *   );
 * }
 */

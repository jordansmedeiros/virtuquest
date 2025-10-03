/**
 * Exports centralizados do módulo N8N
 * @module core/infrastructure/n8n
 *
 * Uso recomendado:
 * ```typescript
 * import { n8nClient, N8N_ENDPOINTS } from '@/core/infrastructure/n8n';
 *
 * // Executar workflow
 * const plan = await n8nClient.createPlan(data);
 *
 * // Acessar endpoints
 * const endpoint = N8N_ENDPOINTS.planejamento.criarPlano;
 * ```
 */

// Cliente principal
export { N8NClient, n8nClient, executeN8NWorkflow } from './client';
export type {
  N8NClientConfig,
  N8NClientMetrics,
  RequestOptions,
} from './client';

// Tipos
export * from './types';

// Endpoints
export { N8N_ENDPOINTS, buildEndpointURL, isValidEndpoint } from './endpoints';
export type { N8NEndpoint, EndpointPath, EndpointTypeMap } from './endpoints';

// Erros
export * from './errors';

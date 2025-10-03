/**
 * Mapeamento tipado de endpoints N8N
 * @module core/infrastructure/n8n/endpoints
 */

import type {
  CreateUserRequest,
  CreateUserResponse,
  AuthUserRequest,
  AuthUserResponse,
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

/**
 * Constante tipada com todos os endpoints N8N disponíveis
 * Organizada hierarquicamente por módulo funcional
 */
export const N8N_ENDPOINTS = {
  usuarios: {
    criar: '/webhook/user/create',
    autenticar: '/webhook/user/auth',
    atualizar: '/webhook/user/update',
    listar: '/webhook/user/list',
  },
  planejamento: {
    criarPlano: '/webhook/planning/create',
    atualizarPlano: '/webhook/planning/update',
    aprovarPlano: '/webhook/planning/approve',
    rejeitarPlano: '/webhook/planning/reject',
    consultarPlanos: '/webhook/planning/query',
    buscarPorId: '/webhook/planning/get',
    deletarPlano: '/webhook/planning/delete',
  },
  ia: {
    sugerirConteudo: '/webhook/ai/suggest-content',
    analisarAlinhamento: '/webhook/ai/analyze-alignment',
    gerarAvaliacao: '/webhook/ai/generate-assessment',
    analisarHabilidades: '/webhook/ai/analyze-skills',
    gerarSituacoes: '/webhook/ai/generate-situations',
  },
  relatorios: {
    progressoBNCC: '/webhook/reports/bncc-progress',
    desenvolvimentoVirtudes: '/webhook/reports/virtues-development',
    eficaciaPedagogica: '/webhook/reports/pedagogical-efficacy',
    coberturaCurricular: '/webhook/reports/curricular-coverage',
  },
  telemetria: {
    registrarEvento: '/webhook/analytics/pedagogical',
    buscarMetricas: '/webhook/analytics/metrics',
  },
  catalogos: {
    buscarBNCC: '/webhook/catalogs/bncc',
    buscarBloom: '/webhook/catalogs/bloom',
    buscarVirtudes: '/webhook/catalogs/virtues',
  },
  estruturaEscolar: {
    criarEscola: '/webhook/school-structure/create-school',
    criarTurma: '/webhook/school-structure/create-class',
    vincularProfessor: '/webhook/school-structure/assign-teacher',
    definirCalendario: '/webhook/school-structure/set-calendar',
  },
  templates: {
    listar: '/webhook/templates/list',
    buscarPorId: '/webhook/templates/get',
    criar: '/webhook/templates/create',
    aplicar: '/webhook/templates/apply',
  },
  avaliacoes: {
    criar: '/webhook/assessment/create',
    gerarRubrica: '/webhook/assessment/generate-rubric',
    registrarResultado: '/webhook/assessment/record-result',
  },
} as const;

/**
 * Tipo derivado da constante de endpoints
 */
export type N8NEndpoint = typeof N8N_ENDPOINTS;

/**
 * Tipo para paths de endpoints
 */
export type EndpointPath = string;

/**
 * Mapeamento de tipos por endpoint
 * Relaciona cada endpoint aos seus tipos de request e response
 */
export interface EndpointTypeMap {
  // Usuários
  '/webhook/user/create': {
    request: CreateUserRequest;
    response: CreateUserResponse;
  };
  '/webhook/user/auth': { request: AuthUserRequest; response: AuthUserResponse };
  '/webhook/user/update': { request: UpdateUserRequest; response: Usuario };
  '/webhook/user/list': {
    request: ListUsersRequest;
    response: ListUsersResponse;
  };

  // Planejamento
  '/webhook/planning/create': {
    request: CreatePlanRequest;
    response: CreatePlanResponse;
  };
  '/webhook/planning/update': {
    request: UpdatePlanRequest;
    response: PlanoAula;
  };
  '/webhook/planning/approve': {
    request: ApprovePlanRequest;
    response: ApprovePlanResponse;
  };
  '/webhook/planning/reject': {
    request: ApprovePlanRequest;
    response: ApprovePlanResponse;
  };
  '/webhook/planning/query': {
    request: QueryPlansRequest;
    response: QueryPlansResponse;
  };
  '/webhook/planning/get': { request: { id: string }; response: PlanoAula };
  '/webhook/planning/delete': { request: { id: string }; response: void };

  // IA
  '/webhook/ai/suggest-content': {
    request: SuggestContentRequest;
    response: SuggestContentResponse;
  };
  '/webhook/ai/analyze-alignment': {
    request: AnalyzeAlignmentRequest;
    response: AnalyzeAlignmentResponse;
  };
  '/webhook/ai/generate-assessment': {
    request: GenerateAssessmentRequest;
    response: GenerateAssessmentResponse;
  };

  // Relatórios
  '/webhook/reports/bncc-progress': {
    request: BNCCProgressRequest;
    response: BNCCProgressResponse;
  };
  '/webhook/reports/virtues-development': {
    request: VirtuesDevelopmentRequest;
    response: VirtuesDevelopmentResponse;
  };

  // Telemetria
  '/webhook/analytics/pedagogical': {
    request: PedagogicalEventRequest;
    response: PedagogicalEventResponse;
  };

  // Catálogos
  '/webhook/catalogs/bncc': { request: void; response: CatalogoBNCC };
  '/webhook/catalogs/bloom': { request: void; response: CatalogoBloom };
  '/webhook/catalogs/virtues': { request: void; response: CatalogoVirtudes };
}

/**
 * Constrói URL completa para um endpoint
 * @param baseURL - URL base do N8N
 * @param endpoint - Path do endpoint
 * @returns URL completa
 */
export function buildEndpointURL(baseURL: string, endpoint: string): string {
  return `${baseURL.replace(/\/$/, '')}${endpoint}`;
}

/**
 * Verifica se um path é um endpoint válido
 * @param path - Path a ser verificado
 * @returns true se o endpoint existe
 */
export function isValidEndpoint(path: string): boolean {
  const allEndpoints = Object.values(N8N_ENDPOINTS).flatMap((group) =>
    Object.values(group)
  );
  return allEndpoints.includes(path);
}

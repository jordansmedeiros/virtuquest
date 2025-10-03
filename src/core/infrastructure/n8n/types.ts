/**
 * Tipos TypeScript para contratos de API N8N
 * @module core/infrastructure/n8n/types
 */

// ============================================================================
// Tipos Base de Request/Response
// ============================================================================

/**
 * Envelope genérico para requisições N8N
 */
export interface N8NRequest<T = unknown> {
  data: T;
  metadata?: {
    requestId?: string;
    timestamp?: number;
    userId?: string;
  };
}

/**
 * Envelope genérico para respostas N8N
 */
export interface N8NResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: N8NError;
  metadata?: {
    requestId?: string;
    processingTime?: number;
    timestamp?: number;
  };
}

/**
 * Estrutura de erro N8N
 */
export interface N8NError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

/**
 * Resposta paginada genérica
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// Enums e Constantes
// ============================================================================

export enum UserType {
  PROFESSOR = 'PROFESSOR',
  COORDENADOR = 'COORDENADOR',
  SUPERVISOR = 'SUPERVISOR',
  DIRETOR = 'DIRETOR',
  ADMIN = 'ADMIN',
}

export enum PlanStatus {
  RASCUNHO = 'rascunho',
  EM_REVISAO = 'em_revisao',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado',
  ARQUIVADO = 'arquivado',
}

export enum PlanLevel {
  EDUCACAO_INFANTIL = 'educacao_infantil',
  FUNDAMENTAL_I = 'fundamental_i',
  FUNDAMENTAL_II = 'fundamental_ii',
  ENSINO_MEDIO = 'ensino_medio',
}

export enum BloomLevel {
  LEMBRAR = 'lembrar',
  ENTENDER = 'entender',
  APLICAR = 'aplicar',
  ANALISAR = 'analisar',
  AVALIAR = 'avaliar',
  CRIAR = 'criar',
}

export enum EventType {
  PLANO_CRIADO = 'plano_criado',
  PLANO_EDITADO = 'plano_editado',
  PLANO_APROVADO = 'plano_aprovado',
  PLANO_REJEITADO = 'plano_rejeitado',
  IA_UTILIZADA = 'ia_utilizada',
  AVALIACAO_GERADA = 'avaliacao_gerada',
  RELATORIO_ACESSADO = 'relatorio_acessado',
  LOGIN = 'login',
  LOGOUT = 'logout',
  TOKEN_REFRESHED = 'token_refreshed',
}

// ============================================================================
// Tipos de Endpoints de Usuários
// ============================================================================

export interface CreateUserRequest {
  nome: string;
  email: string;
  tipo: UserType;
  escola?: string;
  disciplinas?: string[];
}

export interface CreateUserResponse {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  escola?: string;
  disciplinas?: string[];
  createdAt: string;
}

export interface AuthUserRequest {
  email: string;
  senha: string;
}

export interface AuthUserResponse {
  token: string;
  refreshToken: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo: UserType;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LogoutRequest {
  userId: string;
  refreshToken?: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface SessionUser {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  escola?: string;
  disciplinas?: string[];
  permissoes: string[];
}

export interface SessionData {
  user: SessionUser;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UpdateUserRequest {
  id: string;
  nome?: string;
  email?: string;
  escola?: string;
  disciplinas?: string[];
}

export interface ListUsersRequest {
  escolaId?: string;
  tipo?: UserType;
  page?: number;
  limit?: number;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  escola?: string;
  disciplinas?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ListUsersResponse = PaginatedResponse<Usuario>;

// ============================================================================
// Tipos de Endpoints de Planejamento
// ============================================================================

export interface CreatePlanRequest {
  professor: string;
  disciplina: string;
  nivel: PlanLevel;
  competenciasBNCC: string[];
  objetivosBloom: BloomLevel[];
  virtudes: string[];
  conteudo: {
    titulo: string;
    descricao: string;
    objetivos: string[];
    metodologia: string;
    recursos: string[];
    avaliacao: string;
    duracao: number;
  };
}

export interface PlanoAula {
  id: string;
  professor: string;
  disciplina: string;
  nivel: PlanLevel;
  status: PlanStatus;
  competenciasBNCC: string[];
  objetivosBloom: BloomLevel[];
  virtudes: string[];
  conteudo: {
    titulo: string;
    descricao: string;
    objetivos: string[];
    metodologia: string;
    recursos: string[];
    avaliacao: string;
    duracao: number;
  };
  createdAt: string;
  updatedAt: string;
  aprovadoPor?: string;
  aprovadoEm?: string;
}

export interface CreatePlanResponse {
  id: string;
  plano: PlanoAula;
}

export interface UpdatePlanRequest {
  id: string;
  disciplina?: string;
  nivel?: PlanLevel;
  competenciasBNCC?: string[];
  objetivosBloom?: BloomLevel[];
  virtudes?: string[];
  conteudo?: Partial<PlanoAula['conteudo']>;
}

export interface ApprovePlanRequest {
  id: string;
  aprovadorId: string;
  comentarios?: string;
}

export interface ApprovePlanResponse {
  status: PlanStatus;
  timestamp: string;
  aprovador: string;
  comentarios?: string;
}

export interface QueryPlansRequest {
  professorId?: string;
  disciplinaId?: string;
  status?: PlanStatus;
  nivel?: PlanLevel;
  page?: number;
  limit?: number;
}

export type QueryPlansResponse = PaginatedResponse<PlanoAula>;

// ============================================================================
// Tipos de Endpoints de IA
// ============================================================================

export interface SuggestContentRequest {
  contexto: {
    disciplina: string;
    serie: string;
    competencias: string[];
    nivelBloom: BloomLevel[];
    virtudes: string[];
    duracao: number;
    recursos: string[];
    perfilTurma?: string;
  };
}

export interface SugestaoConteudo {
  titulo: string;
  descricao: string;
  recursos: string[];
  atividades: Array<{
    nome: string;
    descricao: string;
    duracao: number;
    nivelBloom: BloomLevel;
  }>;
}

export interface SuggestContentResponse {
  sugestoes: SugestaoConteudo[];
}

export interface AnalyzeAlignmentRequest {
  planoId: string;
  competenciasBNCC: string[];
  objetivosBloom: BloomLevel[];
}

export interface AnalyzeAlignmentResponse {
  score: number;
  gaps: string[];
  recomendacoes: string[];
}

export interface GenerateAssessmentRequest {
  planoId: string;
  tipoAvaliacao: 'objetiva' | 'dissertativa' | 'pratica';
  nivelBloom: BloomLevel[];
}

export interface Questao {
  enunciado: string;
  alternativas?: string[];
  rubrica?: string;
  nivelBloom: BloomLevel;
}

export interface GenerateAssessmentResponse {
  questoes: Questao[];
}

// ============================================================================
// Tipos de Endpoints de Relatórios
// ============================================================================

export interface BNCCProgressRequest {
  escolaId?: string;
  professorId?: string;
  periodo: {
    inicio: string;
    fim: string;
  };
}

export interface BNCCProgressResponse {
  cobertura: number;
  competenciasTrabalhadas: string[];
  gaps: string[];
}

export interface VirtuesDevelopmentRequest {
  escolaId?: string;
  turmaId?: string;
  periodo: {
    inicio: string;
    fim: string;
  };
}

export interface VirtuesDevelopmentResponse {
  virtudes: Array<{
    nome: string;
    nivel: number;
    evolucao: number;
  }>;
}

// ============================================================================
// Tipos de Endpoints de Telemetria
// ============================================================================

export interface PedagogicalEventRequest {
  tipo: EventType;
  contexto: {
    usuario: string;
    escola?: string;
    disciplina?: string;
    nivelEnsino?: PlanLevel;
    timestamp: string;
  };
  dados: {
    tempoGasto?: number;
    tentativas?: number;
    usouIA?: boolean;
    alinhamentoBNCC?: number;
    [key: string]: unknown;
  };
}

export interface PedagogicalEventResponse {
  eventId: string;
  processado: boolean;
}

// ============================================================================
// Tipos de Catálogos Estáticos
// ============================================================================

export interface CompetenciaBNCC {
  codigo: string;
  descricao: string;
  area: string;
  componente: string;
  nivel: PlanLevel;
}

export interface HabilidadeBNCC {
  codigo: string;
  descricao: string;
  competencia: string;
  objetosConhecimento: string[];
}

export interface NivelBloom {
  nivel: BloomLevel;
  descricao: string;
  verbos: string[];
}

export interface VirtudeIntelectual {
  nome: string;
  descricao: string;
  indicadores: string[];
  nivelDesenvolvimento: number;
}

export interface CatalogoBNCC {
  competencias: CompetenciaBNCC[];
  habilidades: HabilidadeBNCC[];
}

export interface CatalogoBloom {
  niveis: NivelBloom[];
}

export interface CatalogoVirtudes {
  virtudes: VirtudeIntelectual[];
}

// ============================================================================
// Tipos de Configuração
// ============================================================================

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenMaxAttempts: number;
}

export interface N8NClientConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
  retryConfig: RetryConfig;
  circuitBreakerConfig: CircuitBreakerConfig;
}

// ============================================================================
// Tipos de Permissões RBAC
// ============================================================================

export type Permission =
  | 'planos.criar'
  | 'planos.editar'
  | 'planos.visualizar'
  | 'planos.deletar'
  | 'planos.aprovar'
  | 'planos.bloquear'
  | 'planos.comentar'
  | 'avaliacoes.criar'
  | 'avaliacoes.editar'
  | 'avaliacoes.visualizar'
  | 'professores.visualizar'
  | 'professores.atribuir_turmas'
  | 'relatorios.gerar'
  | 'relatorios.exportar'
  | 'configuracoes.editar'
  | 'calendario.definir'
  | 'metas_bncc.estabelecer';

export interface RolePermissions {
  role: UserType;
  permissions: Permission[];
  restrictions?: Record<string, boolean>;
}

/**
 * Tipos TypeScript completos para o PlannerEditor
 *
 * Expansão de tipos N8N alinhados com SPECS.md (linhas 1986-2055)
 * e integração com camada de domínio pedagógico.
 *
 * @module types/planner
 */

import type { ProcessoCognitivo } from '@/core/domain/bloom/types';
import type { MomentoDidatico, SituacaoProblema } from '@/core/domain/perrenoud/types';
import type { AlinhamentoPedagogico, HierarquiaPlanejamento } from '@/core/domain/shared/types';
import type { PlanStatus } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Metadados do Plano
// ============================================================================

/**
 * Metadados Básicos do Plano
 *
 * Informações administrativas e contextuais do planejamento.
 * Conforme SPECS.md linha 1993.
 */
export interface MetadadosPlano {
  /** ID único do plano */
  id: string;
  /** Título do plano de aula */
  titulo: string;
  /** Descrição geral e objetivos */
  descricao: string;
  /** Disciplina/Componente curricular */
  disciplina: string;
  /** Série/Ano escolar (ex: '6º ano', '1ª série EM') */
  serie: string;
  /** Turma (ex: '6º A', 'Turma 101') */
  turma: string;
  /** ID do professor responsável */
  professorId: string;
  /** ID da escola */
  escolaId: string;
  /** Nível na hierarquia de planejamento */
  nivel: HierarquiaPlanejamento;
  /** Status de aprovação do plano */
  status: PlanStatus;
  /** Duração total em minutos */
  duracao: number;
  /** Data prevista de execução */
  data: Date;
  /** Data de criação */
  createdAt: Date;
  /** Data de última atualização */
  updatedAt: Date;
  /** Versão do plano (para versionamento) */
  versao: number;
  /** ID do plano pai (nível superior na hierarquia, null se nível mais alto) */
  paiId: string | null;
}

// ============================================================================
// Recursos e Atividades
// ============================================================================

/**
 * Tipo de Recurso Didático
 */
export type TipoRecurso = 'material' | 'tecnologico' | 'espacial' | 'humano';

/**
 * Disponibilidade de Recurso
 */
export type DisponibilidadeRecurso = 'disponivel' | 'solicitar' | 'indisponivel';

/**
 * Recurso Didático
 *
 * Representa materiais, tecnologias ou recursos necessários para as atividades.
 */
export interface RecursoDidatico {
  /** ID único do recurso */
  id: string;
  /** Tipo de recurso */
  tipo: TipoRecurso;
  /** Nome do recurso */
  nome: string;
  /** Descrição detalhada */
  descricao: string;
  /** Status de disponibilidade */
  disponibilidade: DisponibilidadeRecurso;
  /** Quantidade necessária (opcional) */
  quantidade?: number;
}

/**
 * Tipo de Atividade
 */
export type TipoAtividade = 'individual' | 'grupo' | 'coletiva';

/**
 * Atividade Pedagógica
 *
 * Atividade dentro de um momento didático.
 */
export interface Atividade {
  /** ID único da atividade */
  id: string;
  /** Nome da atividade */
  nome: string;
  /** Descrição detalhada */
  descricao: string;
  /** Duração em minutos */
  duracao: number;
  /** Tipo de organização da atividade */
  tipo: TipoAtividade;
  /** Processos cognitivos de Bloom mobilizados */
  processosBloom: ProcessoCognitivo[];
  /** Recursos necessários */
  recursos: RecursoDidatico[];
  /** Instruções para execução */
  instrucoes: string;
}

// ============================================================================
// Momentos Didáticos
// ============================================================================

/**
 * Momento Didático do Plano
 *
 * Expansão de MomentoDidatico de Perrenoud para o planejamento.
 * Representa uma fase da sequência didática.
 */
export interface MomentoDidaticoPlano {
  /** ID único do momento */
  id: string;
  /** Posição na sequência didática */
  ordem: number;
  /** Nome descritivo do momento */
  nome: string;
  /** Tipo de momento segundo Perrenoud */
  tipo: MomentoDidatico;
  /** Duração em minutos */
  duracao: number;
  /** Lista de atividades do momento */
  atividades: Atividade[];
  /** Processos cognitivos mobilizados no momento */
  processosBloom: ProcessoCognitivo[];
  /** Recursos necessários */
  recursos: RecursoDidatico[];
  /** IDs de situações-problema associadas */
  situacoesProblema: string[];
  /** Observações e notas do professor */
  observacoes: string;
}

// ============================================================================
// Virtudes Intelectuais
// ============================================================================

/**
 * Estratégia para Desenvolvimento de Virtude
 *
 * Define como uma virtude intelectual será trabalhada no plano.
 */
export interface EstrategiaVirtude {
  /** ID da virtude */
  virtudeId: string;
  /** Ações pedagógicas para desenvolver a virtude */
  estrategias: string[];
  /** Comportamentos observáveis (evidências de desenvolvimento) */
  indicadoresObservaveis: string[];
  /** Índices dos momentos didáticos onde a virtude é trabalhada */
  momentosTrabalho: number[];
}

// ============================================================================
// Avaliação
// ============================================================================

/**
 * Tipo de Instrumento Avaliativo
 */
export type TipoInstrumento =
  | 'prova'
  | 'trabalho'
  | 'apresentacao'
  | 'portfolio'
  | 'observacao'
  | 'autoavaliacao';

/**
 * Instrumento Avaliativo
 *
 * Ferramenta ou método de avaliação de aprendizagem.
 */
export interface InstrumentoAvaliativo {
  /** ID único do instrumento */
  id: string;
  /** Tipo de instrumento */
  tipo: TipoInstrumento;
  /** Descrição detalhada */
  descricao: string;
  /** Peso na nota final (0-100) */
  peso: number;
  /** Critérios de avaliação */
  criterios: string[];
  /** Processos de Bloom avaliados */
  processosBloom: ProcessoCognitivo[];
}

/**
 * Nível Esperado de Desempenho
 */
export type NivelEsperado = 'inicial' | 'intermediario' | 'avancado';

/**
 * Critério de Avaliação
 *
 * Critério específico para avaliar desempenho do aluno.
 */
export interface CriterioAvaliacao {
  /** ID único do critério */
  id: string;
  /** Descrição do critério */
  descricao: string;
  /** Peso do critério (0-100) */
  peso: number;
  /** Nível esperado de alcance */
  nivelEsperado: NivelEsperado;
  /** Indicadores de evidência de alcance */
  indicadores: string[];
}

/**
 * Nível de Desempenho em Rubrica
 */
export interface NivelRubrica {
  /** Nome do nível (ex: 'Insuficiente', 'Satisfatório', 'Excelente') */
  nivel: string;
  /** Descrição do desempenho neste nível */
  descricao: string;
  /** Critérios para este nível */
  criterios: string[];
}

/**
 * Rubrica de Avaliação
 *
 * Matriz de avaliação com níveis de desempenho.
 * Preparação para geração automática futura.
 */
export interface Rubrica {
  /** ID único da rubrica */
  id: string;
  /** ID da habilidade BNCC avaliada */
  habilidadeId: string;
  /** Níveis de desempenho */
  niveis: NivelRubrica[];
  /** Critérios de avaliação */
  criterios: CriterioAvaliacao[];
}

// ============================================================================
// Plano de Aula Integrado
// ============================================================================

/**
 * Tipo de Avaliação
 */
export type TipoAvaliacao = 'diagnostica' | 'formativa' | 'somativa';

/**
 * Matriz Taxonômica de Bloom
 *
 * Mapeamento de objetivos na taxonomia de Bloom.
 */
export interface MatrizTaxonomica {
  /** Célula principal (código, ex: 'B4' = Analisar + Conceitual) */
  principal: string;
  /** Células secundárias (objetivos complementares) */
  secundarias: string[];
  /** Progressão de processos cognitivos */
  progressao: ProcessoCognitivo[];
}

/**
 * Mobilização de Recursos Cognitivos
 *
 * Conforme teoria de Perrenoud sobre mobilização de saberes.
 */
export interface MobilizacaoRecursos {
  /** IDs de conhecimentos prévios necessários */
  conhecimentosPrevios: string[];
  /** IDs de novos recursos a serem adquiridos */
  novosRecursos: string[];
  /** IDs de esquemas de mobilização */
  esquemasMobilizacao: string[];
}

/**
 * Avaliação do Plano
 *
 * Estratégias e instrumentos de avaliação de aprendizagem.
 */
export interface AvaliacaoPlano {
  /** Tipo de avaliação */
  tipo: TipoAvaliacao;
  /** Instrumentos avaliativos */
  instrumentos: InstrumentoAvaliativo[];
  /** Critérios de avaliação */
  criterios: CriterioAvaliacao[];
  /** Rubricas (preparação para geração automática) */
  rubricas: Rubrica[];
}

/**
 * Reflexão Metacognitiva
 *
 * Estratégias para promover metacognição nos alunos.
 */
export interface ReflexaoMetacognitiva {
  /** O que os alunos devem refletir sobre seu aprendizado */
  objetivosMetacognitivos: string[];
  /** Estratégias de autoavaliação */
  estrategiasAutoavaliacao: string[];
  /** Índices dos momentos didáticos com momentos de reflexão */
  momentosReflexao: number[];
}

/**
 * Validação do Plano
 *
 * Resultado da validação pedagógica completa.
 */
export interface ValidacaoPlano {
  /** Indica se o plano é válido */
  valido: boolean;
  /** Lista de erros impeditivos */
  erros: string[];
  /** Lista de avisos (não bloqueiam publicação) */
  avisos: string[];
  /** Score de qualidade pedagógica (0-100) */
  score: number;
}

/**
 * Plano de Aula Integrado
 *
 * Estrutura completa do planejamento pedagógico integrando
 * BNCC, Bloom, Virtudes e Perrenoud.
 *
 * Conforme SPECS.md linhas 1991-2030.
 *
 * @example
 * ```typescript
 * const plano: PlanoAulaIntegrado = {
 *   id: '123',
 *   metadados: {
 *     titulo: 'Sistema Solar',
 *     disciplina: 'Ciências',
 *     serie: '6º ano',
 *     // ...
 *   },
 *   competenciasGerais: [1, 2, 3],
 *   habilidades: ['EF06CI11', 'EF06CI12'],
 *   matrizTaxonomica: {
 *     principal: 'B4',
 *     secundarias: ['B3'],
 *     progressao: ['ENTENDER', 'APLICAR', 'ANALISAR']
 *   },
 *   // ...
 * };
 * ```
 */
export interface PlanoAulaIntegrado {
  // Identificação e Metadados
  /** ID único do plano */
  id: string;
  /** Metadados administrativos */
  metadados: MetadadosPlano;

  // Alinhamento BNCC
  /** Códigos de competências gerais BNCC (1-10) */
  competenciasGerais: number[];
  /** IDs de competências específicas da área */
  competenciasEspecificas: string[];
  /** Códigos de habilidades BNCC (ex: 'EF67LP08') */
  habilidades: string[];
  /** IDs de objetos de conhecimento */
  objetosConhecimento: string[];

  // Análise Bloom
  /** Mapeamento na matriz taxonômica de Bloom */
  matrizTaxonomica: MatrizTaxonomica;

  // Desenvolvimento de Virtudes
  /** IDs de virtudes intelectuais em foco */
  virtudesFoco: string[];
  /** Estratégias para desenvolvimento de virtudes */
  estrategiasVirtudes: EstrategiaVirtude[];

  // Estrutura Pedagógica (Perrenoud)
  /** IDs de situações-problema de aprendizagem */
  situacoesAprendizagem: string[];
  /** Mobilização de recursos cognitivos */
  mobilizacaoRecursos: MobilizacaoRecursos;

  // Sequência Didática
  /** Momentos didáticos ordenados */
  momentos: MomentoDidaticoPlano[];

  // Avaliação
  /** Estratégias e instrumentos de avaliação */
  avaliacao: AvaliacaoPlano;

  // Metacognição
  /** Estratégias de reflexão metacognitiva */
  reflexaoMetacognitiva: ReflexaoMetacognitiva;

  // Validação e Análise
  /** Resultado da validação pedagógica (gerado pelo motor) */
  alinhamento: AlinhamentoPedagogico;
  /** Validação de coerência */
  validacao: ValidacaoPlano;
}

// ============================================================================
// Tipos Auxiliares para Forms
// ============================================================================

/**
 * Dados do Formulário do Planner
 *
 * Type alias para integração com react-hook-form.
 */
export type PlannerFormData = PlanoAulaIntegrado;

/**
 * Tabs do PlannerEditor
 */
export type PlannerTab =
  | 'conteudo'
  | 'bncc'
  | 'bloom'
  | 'virtudes'
  | 'situacoes'
  | 'avaliacao'
  | 'metacognicao';

/**
 * Status de Autosave
 */
export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Estado de Autosave
 *
 * Gerenciamento de salvamento automático.
 */
export interface AutosaveState {
  /** Status atual do autosave */
  status: AutosaveStatus;
  /** Timestamp do último salvamento bem-sucedido */
  lastSaved: Date | null;
  /** Mensagem de erro (se status = 'error') */
  error: string | null;
}

// ============================================================================
// Tipos para Componentes Específicos
// ============================================================================

/**
 * Props do BNCCSelector
 */
export interface BNCCSelectorProps {
  /** Códigos de habilidades selecionadas */
  value: string[];
  /** Callback de mudança */
  onChange: (habilidades: string[]) => void;
  /** Limite máximo de seleções */
  maxSelections?: number;
  /** Filtrar por componente curricular */
  filterByComponente?: string;
  /** Filtrar por ano escolar */
  filterByAno?: number;
  /** Mostrar competências gerais também */
  showCompetencias?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Props do BloomMapper
 */
export interface BloomMapperProps {
  /** Matriz taxonômica selecionada */
  value: MatrizTaxonomica;
  /** Callback de mudança */
  onChange: (value: MatrizTaxonomica) => void;
  /** Habilidades BNCC para sugestão automática */
  habilidadesBNCC: string[];
  /** Exibir sugestões automáticas */
  showSuggestions?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Props do VirtuesTracker
 */
export interface VirtuesTrackerProps {
  /** Virtudes e estratégias selecionadas */
  value: {
    virtudesFoco: string[];
    estrategias: EstrategiaVirtude[];
  };
  /** Callback de mudança */
  onChange: (value: VirtuesTrackerProps['value']) => void;
  /** Processos Bloom do plano (para filtrar virtudes compatíveis) */
  processosBloom: ProcessoCognitivo[];
  /** Competências BNCC (para filtrar virtudes) */
  competenciasBNCC: number[];
  /** Exibir sugestões automáticas */
  showSuggestions?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Props do SituationsTimeline
 */
export interface SituationsTimelineProps {
  /** IDs de situações-problema ordenadas */
  value: string[];
  /** Callback de mudança */
  onChange: (situacoes: string[]) => void;
  /** 4 momentos de Perrenoud (para agrupar situações) */
  momentos: MomentoDidatico[];
  /** Habilidades BNCC (para sugerir situações compatíveis) */
  habilidadesBNCC: string[];
  /** Processos Bloom (para filtrar situações) */
  processosBloom: ProcessoCognitivo[];
  /** Permitir criar situações customizadas */
  allowCustom?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Props do MomentsManager
 */
export interface MomentsManagerProps {
  /** Momentos didáticos ordenados */
  value: MomentoDidaticoPlano[];
  /** Callback de mudança */
  onChange: (momentos: MomentoDidaticoPlano[]) => void;
  /** Duração total do plano (para validar soma) */
  duracaoTotal: number;
  /** Situações-problema disponíveis (para vincular a momentos) */
  situacoesDisponiveis: SituacaoProblema[];
  /** Classes CSS adicionais */
  className?: string;
}

// ============================================================================
// Helpers de Tipo
// ============================================================================

/**
 * Partial Deep Utility Type
 *
 * Torna todas as propriedades (incluindo aninhadas) opcionais.
 * Útil para updates parciais do plano.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Plano Parcial para Edição
 */
export type PlanoAulaPartial = DeepPartial<PlanoAulaIntegrado>;

/**
 * Extrai tipo de elemento de array
 */
export type ElementOf<T extends readonly unknown[]> = T[number];

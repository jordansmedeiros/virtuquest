/**
 * Tipos TypeScript para estruturas de Perrenoud
 *
 * Teoria das Competências de Philippe Perrenoud:
 * - Competência como mobilização de recursos cognitivos
 * - Situações-problema como contexto de desenvolvimento
 * - Esquemas de mobilização como padrões de ação
 * - 4 momentos didáticos de progressão
 *
 * @see docs/development/SPECS.md (linhas 1757-1808)
 * @see docs/fundamentos/COMPETENCIA_BNCC.md
 */

import type { ProcessoCognitivo, TipoConhecimento } from '../bloom/types';

/**
 * Momentos Didáticos de Perrenoud
 *
 * Progressão pedagógica em 4 etapas:
 * 1. Apropriação: contato inicial, familiarização
 * 2. Aplicação Guiada: prática com suporte
 * 3. Análise/Avaliação: reflexão sobre prática
 * 4. Criação: transferência e autonomia
 */
export type MomentoDidatico = 'apropriacao' | 'aplicacao_guiada' | 'analise_avaliacao' | 'criacao';

/**
 * Níveis de transferibilidade de competências
 */
export type Transferibilidade = 'baixa' | 'media' | 'alta';

/**
 * Complexidade de situações-problema
 */
export type ComplexidadeSituacao = 'simples' | 'intermediaria' | 'complexa';

/**
 * Grau de abertura de situações-problema
 */
export type AberturaSituacao = 'fechada' | 'semi-aberta' | 'aberta';

/**
 * Recurso Cognitivo
 *
 * Elementos mobilizáveis em situações-problema:
 * conhecimentos, habilidades, atitudes, valores.
 *
 * @example
 * {
 *   id: '...',
 *   tipo: 'conhecimento',
 *   categoria: TipoConhecimento.CONCEITUAL,
 *   descricao: 'Teorias de aprendizagem',
 *   mobilizavel: true,
 *   dominio: 'Pedagogia'
 * }
 */
export interface RecursoCognitivo {
  readonly id: string;
  /** Tipo de recurso */
  readonly tipo: 'conhecimento' | 'habilidade' | 'atitude' | 'valor';
  /** Categoria segundo Bloom (para conhecimentos) */
  readonly categoria: TipoConhecimento;
  /** Descrição do recurso */
  readonly descricao: string;
  /** Indica se pode ser mobilizado em situações */
  readonly mobilizavel: boolean;
  /** Domínio/área do recurso */
  readonly dominio: string;
}

/**
 * Passo Cognitivo
 *
 * Operação mental individual em um esquema de mobilização.
 */
export interface PassoCognitivo {
  /** Ordem do passo na sequência */
  readonly ordem: number;
  /** Descrição da ação cognitiva */
  readonly acao: string;
  /** Processo cognitivo Bloom associado */
  readonly processoCognitivo: ProcessoCognitivo;
  /** Recursos utilizados neste passo */
  readonly recursosUtilizados: readonly string[];
  /** Output esperado */
  readonly resultado: string;
}

/**
 * Esquema de Mobilização
 *
 * Padrão de ação cognitiva que mobiliza recursos para resolver
 * uma família de situações-problema.
 *
 * @example
 * {
 *   id: '...',
 *   nome: 'Esquema de leitura analítica',
 *   descricao: 'Estratégia para análise crítica de textos',
 *   passos: [...],
 *   gatilhos: ['Encontro com texto complexo', 'Necessidade de compreensão profunda'],
 *   contextoAplicacao: ['Leitura acadêmica', 'Análise literária'],
 *   recursosEnvolvidos: ['conhecimento-linguistico', 'habilidade-interpretacao']
 * }
 */
export interface EsquemaMobilizacao {
  readonly id: string;
  /** Nome do esquema */
  readonly nome: string;
  /** Descrição do esquema */
  readonly descricao: string;
  /** Sequência ordenada de passos cognitivos */
  readonly passos: readonly PassoCognitivo[];
  /** Situações que ativam o esquema */
  readonly gatilhos: readonly string[];
  /** Contextos onde esquema é aplicável */
  readonly contextoAplicacao: readonly string[];
  /** Recursos mobilizados pelo esquema */
  readonly recursosEnvolvidos: readonly string[];
}

/**
 * Situação-Problema
 *
 * Contexto autêntico que exige mobilização de recursos cognitivos
 * para resolução. Base para desenvolvimento de competências.
 *
 * @example
 * {
 *   id: '...',
 *   competenciaId: '...',
 *   contexto: 'Comunidade escolar enfrenta problemas ambientais',
 *   enunciado: 'Desenvolver campanha de conscientização...',
 *   complexidade: 'complexa',
 *   autenticidade: true,
 *   abertura: 'aberta',
 *   multiplasSolucoes: true,
 *   recursosNecessarios: ['conhecimento-ecologia', 'habilidade-comunicacao'],
 *   processosRequeridos: [ProcessoCognitivo.CRIAR, ProcessoCognitivo.AVALIAR],
 *   momento: 'criacao'
 * }
 */
export interface SituacaoProblema {
  readonly id: string;
  /** Referência à competência desenvolvida (FK) */
  readonly competenciaId: string;
  /** Descrição do contexto */
  readonly contexto: string;
  /** Enunciado da situação-problema */
  readonly enunciado: string;
  /** Nível de complexidade */
  readonly complexidade: ComplexidadeSituacao;

  // Características da situação
  /** Situação autêntica (real) vs artificial */
  readonly autenticidade: boolean;
  /** Grau de estruturação */
  readonly abertura: AberturaSituacao;
  /** Admite múltiplas soluções válidas */
  readonly multiplasSolucoes: boolean;

  // Recursos e processos
  /** Recursos cognitivos necessários */
  readonly recursosNecessarios: readonly string[];
  /** Processos cognitivos Bloom envolvidos */
  readonly processosRequeridos: readonly ProcessoCognitivo[];

  // Progressão pedagógica
  /** Momento didático de Perrenoud */
  readonly momento: MomentoDidatico;
}

/**
 * Competência segundo Perrenoud
 *
 * Capacidade de mobilizar recursos cognitivos para agir eficazmente
 * em uma família de situações-problema.
 *
 * @example
 * {
 *   id: '...',
 *   nome: 'Competência de leitura crítica',
 *   descricao: 'Mobilizar recursos para compreender e avaliar textos',
 *   recursos: [...],
 *   situacoesFamilia: [...],
 *   esquemasMobilizacao: [...],
 *   contextoEspecifico: true,
 *   transferibilidade: 'media',
 *   complexidadeCognitiva: 4
 * }
 */
export interface Competencia {
  readonly id: string;
  /** Nome da competência */
  readonly nome: string;
  /** Descrição da competência */
  readonly descricao: string;

  // Elementos constitutivos (Perrenoud)
  /** Recursos mobilizáveis (conhecimentos, habilidades, atitudes, valores) */
  readonly recursos: readonly RecursoCognitivo[];
  /** Família de situações onde competência se aplica */
  readonly situacoesFamilia: readonly SituacaoProblema[];
  /** Padrões de ação cognitiva */
  readonly esquemasMobilizacao: readonly EsquemaMobilizacao[];

  // Características
  /** Competência específica de um domínio */
  readonly contextoEspecifico: boolean;
  /** Nível de transferibilidade */
  readonly transferibilidade: Transferibilidade;
  /** Complexidade cognitiva (1-5) */
  readonly complexidadeCognitiva: 1 | 2 | 3 | 4 | 5;
}

/**
 * Progressão através dos 4 momentos de Perrenoud
 */
export interface ProgressaoPerrenoud {
  /** Sequência de momentos com situações-problema */
  readonly momentos: readonly Array<{
    readonly momento: MomentoDidatico;
    readonly situacoes: readonly SituacaoProblema[];
  }>;
  /** Indica se há progressão de complexidade */
  readonly complexidadeCrescente: boolean;
  /** Transferibilidade esperada ao final */
  readonly transferibilidadeEsperada: Transferibilidade;
}

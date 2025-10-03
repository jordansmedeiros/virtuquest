/**
 * Tipos TypeScript para Virtudes Intelectuais
 *
 * Virtudes intelectuais são disposições de caráter relacionadas
 * à busca e uso do conhecimento:
 * - Virtudes epistêmicas (conhecimento)
 * - Virtudes morais (ética intelectual)
 * - Virtudes práticas (ação)
 *
 * @see docs/development/SPECS.md (linhas 1813-1868)
 */

import type { ProcessoCognitivo } from '../bloom/types';

/**
 * Categorias de Virtudes Intelectuais
 */
export enum CategoriaVirtude {
  /** Relacionadas ao conhecimento e epistemologia */
  EPISTEMICA = 'epistemica',
  /** Relacionadas à ética intelectual */
  MORAL = 'moral',
  /** Relacionadas à ação e prática */
  PRATICA = 'pratica',
}

/**
 * Níveis de Desenvolvimento de Virtudes
 */
export enum NivelDesenvolvimento {
  /** Nível inicial de desenvolvimento */
  INICIAL = 'inicial',
  /** Nível intermediário */
  INTERMEDIARIO = 'intermediario',
  /** Nível avançado */
  AVANCADO = 'avancado',
}

/**
 * Indicador de Virtude
 *
 * Comportamento observável que evidencia o desenvolvimento de uma virtude.
 *
 * @example
 * {
 *   id: '...',
 *   virtudeId: 'curiosidade-intelectual',
 *   descricao: 'Formula perguntas investigativas',
 *   evidencias: [
 *     'Faz perguntas além do conteúdo apresentado',
 *     'Questiona pressupostos e afirmações',
 *     'Busca compreender causas e relações'
 *   ],
 *   situacoesExemplo: [
 *     'Durante discussões em aula',
 *     'Ao ler textos acadêmicos',
 *     'Em trabalhos de pesquisa'
 *   ],
 *   nivelEsperado: NivelDesenvolvimento.INTERMEDIARIO
 * }
 */
export interface IndicadorVirtude {
  readonly id: string;
  /** Referência à virtude (FK) */
  readonly virtudeId: string;
  /** Descrição do indicador */
  readonly descricao: string;
  /** Comportamentos observáveis */
  readonly evidencias: readonly string[];
  /** Situações onde indicador se manifesta */
  readonly situacoesExemplo: readonly string[];
  /** Nível onde indicador é típico */
  readonly nivelEsperado: NivelDesenvolvimento;
}

/**
 * Virtude Intelectual
 *
 * Disposição de caráter que facilita o pensamento crítico,
 * a busca de conhecimento e o uso responsável da razão.
 *
 * @example
 * {
 *   id: 'curiosidade-intelectual',
 *   nome: 'Curiosidade Intelectual',
 *   categoria: CategoriaVirtude.EPISTEMICA,
 *   definicao: 'Disposição para buscar conhecimento, fazer perguntas e explorar ideias',
 *   indicadores: [...],
 *   processosBloomRelacionados: [ProcessoCognitivo.ANALISAR, ProcessoCognitivo.CRIAR],
 *   competenciasBNCCRelacionadas: [2],
 *   nivelDesenvolvimento: {
 *     inicial: 'Faz perguntas básicas sobre tópicos apresentados',
 *     intermediario: 'Investiga sistematicamente temas de interesse',
 *     avancado: 'Formula hipóteses originais e busca validá-las'
 *   }
 * }
 */
export interface VirtudeIntelectual {
  readonly id: string;
  /** Nome da virtude */
  readonly nome: string;
  /** Categoria da virtude */
  readonly categoria: CategoriaVirtude;
  /** Definição teórica */
  readonly definicao: string;
  /** Indicadores observáveis */
  readonly indicadores: readonly IndicadorVirtude[];

  // Relações com outros modelos
  /** Processos Bloom que mobilizam esta virtude */
  readonly processosBloomRelacionados: readonly ProcessoCognitivo[];
  /** Competências gerais BNCC (códigos 1-10) */
  readonly competenciasBNCCRelacionadas: readonly number[];

  // Desenvolvimento
  /** Descrições por nível de desenvolvimento */
  readonly nivelDesenvolvimento: Readonly<{
    inicial: string;
    intermediario: string;
    avancado: string;
  }>;
}

/**
 * Mapeamento de Virtude para processos e competências
 */
export interface MapaVirtudes {
  /** Nome da virtude */
  readonly virtude: string;
  /** Processos Bloom relacionados */
  readonly processosBloom: readonly ProcessoCognitivo[];
  /** Competências gerais BNCC (1-10) */
  readonly competenciasBNCC: readonly number[];
  /** Categoria da virtude */
  readonly categoria: CategoriaVirtude;
}

/**
 * Perfil de Desenvolvimento de Virtudes
 *
 * Retrato do desenvolvimento de virtudes intelectuais
 * de um aluno ou turma ao longo do tempo.
 */
export interface PerfilVirtudes {
  /** Virtudes já desenvolvidas com evidências */
  readonly virtudesDesenvolvidas: ReadonlyArray<
    Readonly<{
      virtude: string;
      nivel: NivelDesenvolvimento;
      evidencias: readonly string[];
    }>
  >;
  /** Virtudes prioritárias para desenvolvimento */
  readonly virtudesPrioritarias: readonly string[];
  /** Evolução temporal (score 0-100) */
  readonly progressao: ReadonlyArray<
    Readonly<{
      virtude: string;
      evolucao: number;
    }>
  >;
}

/**
 * Virtudes Core do Sistema
 *
 * 6 virtudes principais conforme Specs.md linha 1846
 */
export const VIRTUDES_CORE = [
  'CURIOSIDADE_INTELECTUAL',
  'HUMILDADE_INTELECTUAL',
  'CORAGEM_INTELECTUAL',
  'AUTONOMIA_INTELECTUAL',
  'PERSEVERANCA',
  'RIGOR_INTELECTUAL',
] as const;

export type VirtudeCore = (typeof VIRTUDES_CORE)[number];

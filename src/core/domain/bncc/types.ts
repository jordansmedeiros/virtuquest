/**
 * Tipos TypeScript para BNCC (Base Nacional Comum Curricular)
 *
 * Estrutura hierárquica:
 * - CompetenciaGeral (10 competências da BNCC)
 * - CompetenciaEspecifica (por área de conhecimento)
 * - Habilidade (codificada, ex: EF67LP08)
 * - ObjetoConhecimento (conteúdos curriculares)
 *
 * @see docs/development/SPECS.md (linhas 1643-1685)
 * @see docs/fundamentos/COMPETENCIA_BNCC.md
 */

/**
 * Etapas da Educação Básica
 */
export enum Etapa {
  /** Educação Infantil */
  EI = 'EI',
  /** Ensino Fundamental */
  EF = 'EF',
  /** Ensino Médio */
  EM = 'EM',
}

/**
 * Áreas de Conhecimento da BNCC
 */
export enum AreaConhecimento {
  LINGUAGENS = 'LINGUAGENS',
  MATEMATICA = 'MATEMATICA',
  CIENCIAS_NATUREZA = 'CIENCIAS_NATUREZA',
  CIENCIAS_HUMANAS = 'CIENCIAS_HUMANAS',
  ENSINO_RELIGIOSO = 'ENSINO_RELIGIOSO',
}

/**
 * Componentes Curriculares
 */
export enum ComponenteCurricular {
  LINGUA_PORTUGUESA = 'LINGUA_PORTUGUESA',
  ARTE = 'ARTE',
  EDUCACAO_FISICA = 'EDUCACAO_FISICA',
  LINGUA_INGLESA = 'LINGUA_INGLESA',
  MATEMATICA = 'MATEMATICA',
  CIENCIAS = 'CIENCIAS',
  GEOGRAFIA = 'GEOGRAFIA',
  HISTORIA = 'HISTORIA',
  ENSINO_RELIGIOSO = 'ENSINO_RELIGIOSO',
}

/**
 * Códigos das 10 Competências Gerais da BNCC
 */
export type CodigoCompetenciaGeral = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Padrão de código de habilidade BNCC
 * Formato: ETAPA + ANOS + COMPONENTE + SEQUENCIA
 * Exemplo: EF67LP08 = Ensino Fundamental, anos 6-7, Língua Portuguesa, habilidade 08
 */
export type CodigoHabilidadeBNCC = string;

/**
 * Competência Geral da BNCC
 *
 * As 10 competências gerais da BNCC definem direitos de aprendizagem
 * que mobilizam conhecimentos, habilidades, atitudes e valores.
 *
 * @example
 * {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   codigo: 2,
 *   descricao: 'Exercitar a curiosidade intelectual...',
 *   dimensoes: {
 *     conhecimentos: ['Método científico', 'Pesquisa'],
 *     habilidades: ['Investigar', 'Questionar'],
 *     atitudes: ['Curiosidade', 'Abertura'],
 *     valores: ['Verdade', 'Rigor intelectual']
 *   }
 * }
 */
export interface CompetenciaGeral {
  /** UUID da competência */
  readonly id: string;
  /** Código numérico (1-10) */
  readonly codigo: CodigoCompetenciaGeral;
  /** Descrição completa da competência */
  readonly descricao: string;
  /** Dimensões da competência (conhecimentos, habilidades, atitudes, valores) */
  readonly dimensoes: {
    /** Conhecimentos mobilizados pela competência */
    readonly conhecimentos: readonly string[];
    /** Habilidades desenvolvidas */
    readonly habilidades: readonly string[];
    /** Atitudes esperadas */
    readonly atitudes: readonly string[];
    /** Valores promovidos */
    readonly valores: readonly string[];
  };
}

/**
 * Competência Específica por Área de Conhecimento
 *
 * Desdobramentos das competências gerais para áreas específicas.
 *
 * @example
 * {
 *   id: '...',
 *   competenciaGeralId: '550e8400-e29b-41d4-a716-446655440000',
 *   areaConhecimento: AreaConhecimento.LINGUAGENS,
 *   descricao: 'Compreender as linguagens como construção humana...',
 *   componenteCurricular: ComponenteCurricular.LINGUA_PORTUGUESA
 * }
 */
export interface CompetenciaEspecifica {
  readonly id: string;
  /** Referência à competência geral (FK) */
  readonly competenciaGeralId: string;
  /** Área de conhecimento desta competência */
  readonly areaConhecimento: AreaConhecimento;
  /** Descrição da competência específica */
  readonly descricao: string;
  /** Componente curricular (opcional, pode ser geral para a área) */
  readonly componenteCurricular?: ComponenteCurricular;
}

/**
 * Objeto de Conhecimento
 *
 * Conteúdos, conceitos e processos organizados em unidades temáticas
 * ou campos de experiência.
 *
 * @example
 * {
 *   id: '...',
 *   nome: 'Estratégias de leitura',
 *   descricao: 'Localização de informações em textos',
 *   unidadeTematica: 'Leitura/escuta'
 * }
 */
export interface ObjetoConhecimento {
  readonly id: string;
  /** Nome do objeto de conhecimento */
  readonly nome: string;
  /** Descrição detalhada */
  readonly descricao: string;
  /** Campo de experiência (Educação Infantil) */
  readonly campoExperiencia?: string;
  /** Unidade temática (Ensino Fundamental) */
  readonly unidadeTematica?: string;
}

/**
 * Habilidade da BNCC
 *
 * Objetivos de aprendizagem e desenvolvimento expressos por meio de verbos
 * que indicam processos cognitivos.
 *
 * Código segue padrão: ETAPA + ANOS + COMPONENTE + SEQUENCIA
 * - EF67LP08: Ensino Fundamental, anos 6-7, Língua Portuguesa, habilidade 08
 * - EM13CNT101: Ensino Médio, 1ª-3ª série, Ciências da Natureza, habilidade 101
 *
 * @example
 * {
 *   id: '...',
 *   codigo: 'EF67LP08',
 *   competenciaEspecificaId: '...',
 *   descricao: 'Identificar os efeitos de sentido...',
 *   objetosConhecimento: [{ id: '...', nome: 'Efeitos de sentido', ... }],
 *   etapa: Etapa.EF,
 *   ano: '67',
 *   componente: 'LP',
 *   sequencia: 8
 * }
 */
export interface Habilidade {
  readonly id: string;
  /** Código BNCC (ex: EF67LP08) */
  readonly codigo: CodigoHabilidadeBNCC;
  /** Referência à competência específica (FK) */
  readonly competenciaEspecificaId: string;
  /** Descrição completa da habilidade */
  readonly descricao: string;
  /** Objetos de conhecimento associados */
  readonly objetosConhecimento: readonly ObjetoConhecimento[];

  // Decomposição automática do código
  /** Etapa (EI, EF, EM) */
  readonly etapa: Etapa;
  /** Anos (ex: '67' para 6º e 7º ano, '01' para 1º ano) */
  readonly ano: string;
  /** Componente curricular (ex: 'LP', 'MA', 'CI') */
  readonly componente: string;
  /** Sequência numérica da habilidade */
  readonly sequencia: number;
}

/**
 * Resultado da decomposição de código BNCC
 *
 * @example
 * {
 *   etapa: Etapa.EF,
 *   anos: [6, 7],
 *   componente: 'LP',
 *   sequencia: 8,
 *   codigoOriginal: 'EF67LP08'
 * }
 */
export interface HabilidadeDecomposta {
  /** Etapa da educação básica */
  readonly etapa: Etapa;
  /** Anos escolares (array, ex: [6, 7]) */
  readonly anos: readonly number[];
  /** Sigla do componente curricular */
  readonly componente: string;
  /** Número sequencial da habilidade */
  readonly sequencia: number;
  /** Código BNCC original */
  readonly codigoOriginal: string;
}

/**
 * Tipos TypeScript para Taxonomia de Bloom Revisada
 *
 * Taxonomia bidimensional (Anderson & Krathwohl, 2001):
 * - Dimensão Cognitiva: 6 processos (Lembrar → Criar)
 * - Dimensão do Conhecimento: 4 tipos (Factual → Metacognitivo)
 * - Matriz: 6 × 4 = 24 células taxonômicas
 *
 * @see docs/development/SPECS.md (linhas 1690-1752)
 * @see docs/fundamentos/TAXONOMIA_BLOOM_BNCC.md
 */

/**
 * Processos Cognitivos da Taxonomia de Bloom Revisada
 *
 * Hierarquia crescente de complexidade cognitiva (1-6).
 * Baseado em Anderson & Krathwohl (2001).
 */
export enum ProcessoCognitivo {
  /** Recuperar conhecimento da memória de longo prazo */
  LEMBRAR = 1,
  /** Construir significado a partir de mensagens instrucionais */
  ENTENDER = 2,
  /** Executar ou usar um procedimento */
  APLICAR = 3,
  /** Decompor material e determinar relações entre partes */
  ANALISAR = 4,
  /** Fazer julgamentos baseados em critérios e padrões */
  AVALIAR = 5,
  /** Reunir elementos para formar um todo coerente e funcional */
  CRIAR = 6,
}

/**
 * Tipos de Conhecimento da Taxonomia Revisada
 *
 * Letras seguem convenção de Anderson & Krathwohl (2001).
 */
export enum TipoConhecimento {
  /** Conhecimento de terminologia e detalhes específicos */
  FACTUAL = 'A',
  /** Conhecimento de classificações, princípios, teorias, modelos */
  CONCEITUAL = 'B',
  /** Conhecimento de algoritmos, técnicas, métodos */
  PROCEDIMENTAL = 'C',
  /** Conhecimento sobre cognição e autoconsciência */
  METACOGNITIVO = 'D',
}

/**
 * Subprocessos do processo LEMBRAR
 */
export type SubprocessosLembrar = 'reconhecer' | 'recordar';

/**
 * Subprocessos do processo ENTENDER
 */
export type SubprocessosEntender =
  | 'interpretar'
  | 'exemplificar'
  | 'classificar'
  | 'resumir'
  | 'inferir'
  | 'comparar'
  | 'explicar';

/**
 * Subprocessos do processo APLICAR
 */
export type SubprocessosAplicar = 'executar' | 'implementar';

/**
 * Subprocessos do processo ANALISAR
 */
export type SubprocessosAnalisar = 'diferenciar' | 'organizar' | 'atribuir';

/**
 * Subprocessos do processo AVALIAR
 */
export type SubprocessosAvaliar = 'checar' | 'criticar';

/**
 * Subprocessos do processo CRIAR
 */
export type SubprocessosCriar = 'gerar' | 'planejar' | 'produzir';

/**
 * Union type de todos os subprocessos
 */
export type Subprocesso =
  | SubprocessosLembrar
  | SubprocessosEntender
  | SubprocessosAplicar
  | SubprocessosAnalisar
  | SubprocessosAvaliar
  | SubprocessosCriar;

/**
 * Subprocesso Cognitivo com metadados
 */
export interface SubprocessoCognitivo {
  /** Processo cognitivo ao qual pertence */
  readonly processo: ProcessoCognitivo;
  /** Lista de subprocessos */
  readonly subprocessos: readonly Subprocesso[];
  /** Descrição do processo */
  readonly descricao: string;
  /** Verbos de ação característicos */
  readonly verbosAcao: readonly string[];
}

/**
 * Subtipos de Conhecimento Factual
 */
export type SubtiposFactual = 'terminologia' | 'detalhes_especificos';

/**
 * Subtipos de Conhecimento Conceitual
 */
export type SubtiposConceitual =
  | 'classificacoes'
  | 'principios'
  | 'teorias'
  | 'modelos'
  | 'estruturas';

/**
 * Subtipos de Conhecimento Procedimental
 */
export type SubtiposProcedimental = 'algoritmos' | 'tecnicas' | 'metodos' | 'criterios';

/**
 * Subtipos de Conhecimento Metacognitivo
 */
export type SubtiposMetacognitivo = 'estrategico' | 'tarefas_cognitivas' | 'autoconhecimento';

/**
 * Union type de todos os subtipos de conhecimento
 */
export type SubtipoConhecimento =
  | SubtiposFactual
  | SubtiposConceitual
  | SubtiposProcedimental
  | SubtiposMetacognitivo;

/**
 * Conhecimento Detalhado com subtipos
 */
export interface ConhecimentoDetalhado {
  /** Tipo de conhecimento */
  readonly tipo: TipoConhecimento;
  /** Subtipo específico */
  readonly subtipo: SubtipoConhecimento;
  /** Descrição do tipo de conhecimento */
  readonly descricao: string;
  /** Exemplos concretos */
  readonly exemplos: readonly string[];
}

/**
 * Códigos válidos de células da matriz Bloom (24 combinações)
 * Formato: TIPO_CONHECIMENTO + PROCESSO_COGNITIVO
 * Exemplo: 'B4' = Conhecimento Conceitual × Analisar
 */
export type CodigoCelula =
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'B5'
  | 'B6'
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'C6'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D5'
  | 'D6';

/**
 * Célula da Matriz Taxonômica de Bloom
 *
 * Representa a interseção entre um processo cognitivo e um tipo de conhecimento.
 * Total de 24 células (6 processos × 4 tipos).
 *
 * @example
 * {
 *   id: '...',
 *   codigo: 'B4',
 *   processoCognitivo: ProcessoCognitivo.ANALISAR,
 *   tipoConhecimento: TipoConhecimento.CONCEITUAL,
 *   descricao: 'Analisar relações entre conceitos, princípios e teorias',
 *   exemplosContextualizados: ['Comparar teorias evolutivas', 'Diferenciar sistemas políticos'],
 *   verbosCaracteristicos: ['comparar', 'contrastar', 'diferenciar', 'organizar']
 * }
 */
export interface CelulaTaxonomica {
  /** UUID da célula */
  readonly id: string;
  /** Código da célula (A1-D6) */
  readonly codigo: CodigoCelula;
  /** Processo cognitivo (1-6) */
  readonly processoCognitivo: ProcessoCognitivo;
  /** Tipo de conhecimento (A-D) */
  readonly tipoConhecimento: TipoConhecimento;
  /** Descrição da interseção processo × conhecimento */
  readonly descricao: string;
  /** Exemplos educacionais contextualizados */
  readonly exemplosContextualizados: readonly string[];
  /** Verbos típicos desta célula */
  readonly verbosCaracteristicos: readonly string[];
}

/**
 * Matriz Completa de Bloom
 *
 * Estrutura bidimensional com 24 células.
 */
export interface MatrizBloom {
  /** Array com as 24 células */
  readonly celulas: readonly CelulaTaxonomica[];
  /** Helper para buscar célula específica */
  getCelula(processo: ProcessoCognitivo, conhecimento: TipoConhecimento): CelulaTaxonomica | null;
}

/**
 * Progressão Cognitiva segundo Bloom
 *
 * Representa uma sequência de processos cognitivos em ordem crescente de complexidade.
 *
 * @example
 * {
 *   processos: [ProcessoCognitivo.LEMBRAR, ProcessoCognitivo.ENTENDER, ProcessoCognitivo.APLICAR],
 *   complexidadeCrescente: true,
 *   justificativa: 'Progressão adequada do simples ao complexo'
 * }
 */
export interface ProgressaoBloom {
  /** Sequência de processos cognitivos */
  readonly processos: readonly ProcessoCognitivo[];
  /** Indica se complexidade é crescente */
  readonly complexidadeCrescente: boolean;
  /** Justificativa pedagógica da progressão */
  readonly justificativa: string;
}

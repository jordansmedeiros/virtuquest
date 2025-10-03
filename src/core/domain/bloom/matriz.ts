/**
 * Matriz Bidimensional de Bloom Revisada
 *
 * 24 células resultantes da combinação de:
 * - 6 processos cognitivos (Lembrar → Criar)
 * - 4 tipos de conhecimento (Factual → Metacognitivo)
 *
 * Baseado em Anderson & Krathwohl (2001)
 * @see docs/fundamentos/TAXONOMIA_BLOOM_BNCC.md
 */

import {
  ProcessoCognitivo,
  TipoConhecimento,
  type CelulaTaxonomica,
  type CodigoCelula,
} from './types';

/**
 * Matriz completa de Bloom com as 24 células
 *
 * Cada célula representa a interseção entre um processo cognitivo
 * e um tipo de conhecimento, com exemplos contextualizados para educação brasileira.
 */
export const MATRIZ_BLOOM_COMPLETA: readonly CelulaTaxonomica[] = [
  // Linha A: Conhecimento Factual
  {
    id: 'celula-a1',
    codigo: 'A1',
    processoCognitivo: ProcessoCognitivo.LEMBRAR,
    tipoConhecimento: TipoConhecimento.FACTUAL,
    descricao: 'Recordar terminologia e fatos específicos',
    exemplosContextualizados: [
      'Listar capitais dos estados brasileiros',
      'Nomear elementos da tabela periódica',
      'Identificar datas históricas importantes',
      'Reconhecer símbolos matemáticos básicos',
    ],
    verbosCaracteristicos: [
      'listar',
      'nomear',
      'identificar',
      'rotular',
      'memorizar',
      'reconhecer',
    ],
  },
  {
    id: 'celula-a2',
    codigo: 'A2',
    processoCognitivo: ProcessoCognitivo.ENTENDER,
    tipoConhecimento: TipoConhecimento.FACTUAL,
    descricao: 'Compreender significado de termos e fatos',
    exemplosContextualizados: [
      'Explicar o significado de termos técnicos',
      'Parafrasear definições científicas',
      'Interpretar símbolos e abreviações',
      'Exemplificar conceitos com fatos concretos',
    ],
    verbosCaracteristicos: ['explicar', 'parafrasear', 'interpretar', 'exemplificar', 'resumir'],
  },
  {
    id: 'celula-a3',
    codigo: 'A3',
    processoCognitivo: ProcessoCognitivo.APLICAR,
    tipoConhecimento: TipoConhecimento.FACTUAL,
    descricao: 'Usar terminologia e fatos em situações específicas',
    exemplosContextualizados: [
      'Usar vocabulário técnico em textos',
      'Aplicar datas históricas para contextualizar eventos',
      'Empregar notação matemática em problemas',
      'Demonstrar uso correto de termos científicos',
    ],
    verbosCaracteristicos: ['usar', 'aplicar', 'empregar', 'demonstrar', 'executar'],
  },
  {
    id: 'celula-a4',
    codigo: 'A4',
    processoCognitivo: ProcessoCognitivo.ANALISAR,
    tipoConhecimento: TipoConhecimento.FACTUAL,
    descricao: 'Diferenciar e organizar elementos factuais',
    exemplosContextualizados: [
      'Categorizar fatos históricos por período',
      'Distinguir entre termos semelhantes',
      'Organizar dados em tabelas e gráficos',
      'Identificar relações entre fatos isolados',
    ],
    verbosCaracteristicos: ['categorizar', 'distinguir', 'organizar', 'diferenciar', 'comparar'],
  },
  {
    id: 'celula-a5',
    codigo: 'A5',
    processoCognitivo: ProcessoCognitivo.AVALIAR,
    tipoConhecimento: TipoConhecimento.FACTUAL,
    descricao: 'Julgar precisão e relevância de fatos',
    exemplosContextualizados: [
      'Verificar exatidão de dados apresentados',
      'Avaliar confiabilidade de fontes factuais',
      'Checar consistência de informações',
      'Criticar uso inadequado de terminologia',
    ],
    verbosCaracteristicos: ['verificar', 'checar', 'avaliar', 'criticar', 'julgar'],
  },
  {
    id: 'celula-a6',
    codigo: 'A6',
    processoCognitivo: ProcessoCognitivo.CRIAR,
    tipoConhecimento: TipoConhecimento.FACTUAL,
    descricao: 'Gerar novos conjuntos de fatos e terminologias',
    exemplosContextualizados: [
      'Criar glossários especializados',
      'Desenvolver bancos de dados factuais',
      'Formular listas de termos técnicos',
      'Produzir cronologias históricas',
    ],
    verbosCaracteristicos: ['criar', 'desenvolver', 'formular', 'produzir', 'gerar'],
  },

  // Linha B: Conhecimento Conceitual
  {
    id: 'celula-b1',
    codigo: 'B1',
    processoCognitivo: ProcessoCognitivo.LEMBRAR,
    tipoConhecimento: TipoConhecimento.CONCEITUAL,
    descricao: 'Recordar classificações, princípios e teorias',
    exemplosContextualizados: [
      'Listar princípios científicos fundamentais',
      'Reconhecer teorias de aprendizagem',
      'Identificar sistemas de classificação',
      'Nomear modelos explicativos',
    ],
    verbosCaracteristicos: ['listar', 'reconhecer', 'identificar', 'nomear', 'recordar'],
  },
  {
    id: 'celula-b2',
    codigo: 'B2',
    processoCognitivo: ProcessoCognitivo.ENTENDER,
    tipoConhecimento: TipoConhecimento.CONCEITUAL,
    descricao: 'Compreender relações entre conceitos e princípios',
    exemplosContextualizados: [
      'Explicar teorias científicas com exemplos',
      'Interpretar modelos conceituais',
      'Comparar diferentes sistemas de classificação',
      'Resumir princípios fundamentais',
    ],
    verbosCaracteristicos: ['explicar', 'interpretar', 'comparar', 'resumir', 'classificar'],
  },
  {
    id: 'celula-b3',
    codigo: 'B3',
    processoCognitivo: ProcessoCognitivo.APLICAR,
    tipoConhecimento: TipoConhecimento.CONCEITUAL,
    descricao: 'Aplicar teorias e princípios em situações concretas',
    exemplosContextualizados: [
      'Usar teorias para explicar fenômenos',
      'Implementar princípios em projetos',
      'Aplicar modelos conceituais a casos reais',
      'Resolver problemas usando teorias',
    ],
    verbosCaracteristicos: ['usar', 'implementar', 'aplicar', 'resolver', 'demonstrar'],
  },
  {
    id: 'celula-b4',
    codigo: 'B4',
    processoCognitivo: ProcessoCognitivo.ANALISAR,
    tipoConhecimento: TipoConhecimento.CONCEITUAL,
    descricao: 'Analisar relações entre conceitos, princípios e teorias',
    exemplosContextualizados: [
      'Comparar teorias evolutivas',
      'Diferenciar sistemas políticos',
      'Organizar conceitos matemáticos em hierarquia',
      'Desconstruir modelos complexos',
    ],
    verbosCaracteristicos: ['comparar', 'contrastar', 'diferenciar', 'organizar', 'desconstruir'],
  },
  {
    id: 'celula-b5',
    codigo: 'B5',
    processoCognitivo: ProcessoCognitivo.AVALIAR,
    tipoConhecimento: TipoConhecimento.CONCEITUAL,
    descricao: 'Julgar validade de teorias e modelos conceituais',
    exemplosContextualizados: [
      'Criticar teorias com base em evidências',
      'Avaliar adequação de modelos explicativos',
      'Julgar consistência lógica de princípios',
      'Revisar classificações científicas',
    ],
    verbosCaracteristicos: ['criticar', 'avaliar', 'julgar', 'revisar', 'testar'],
  },
  {
    id: 'celula-b6',
    codigo: 'B6',
    processoCognitivo: ProcessoCognitivo.CRIAR,
    tipoConhecimento: TipoConhecimento.CONCEITUAL,
    descricao: 'Criar novas teorias, modelos e sistemas conceituais',
    exemplosContextualizados: [
      'Desenvolver modelos explicativos originais',
      'Formular teorias a partir de observações',
      'Projetar sistemas de classificação',
      'Construir frameworks conceituais',
    ],
    verbosCaracteristicos: ['desenvolver', 'formular', 'projetar', 'construir', 'inventar'],
  },

  // Linha C: Conhecimento Procedimental
  {
    id: 'celula-c1',
    codigo: 'C1',
    processoCognitivo: ProcessoCognitivo.LEMBRAR,
    tipoConhecimento: TipoConhecimento.PROCEDIMENTAL,
    descricao: 'Recordar algoritmos, técnicas e métodos',
    exemplosContextualizados: [
      'Listar etapas de métodos científicos',
      'Reconhecer algoritmos matemáticos',
      'Identificar técnicas de pesquisa',
      'Nomear procedimentos experimentais',
    ],
    verbosCaracteristicos: ['listar', 'reconhecer', 'identificar', 'nomear', 'relembrar'],
  },
  {
    id: 'celula-c2',
    codigo: 'C2',
    processoCognitivo: ProcessoCognitivo.ENTENDER,
    tipoConhecimento: TipoConhecimento.PROCEDIMENTAL,
    descricao: 'Compreender como e quando usar procedimentos',
    exemplosContextualizados: [
      'Explicar funcionamento de algoritmos',
      'Interpretar fluxogramas de processos',
      'Resumir etapas de métodos',
      'Exemplificar aplicações de técnicas',
    ],
    verbosCaracteristicos: ['explicar', 'interpretar', 'resumir', 'exemplificar', 'descrever'],
  },
  {
    id: 'celula-c3',
    codigo: 'C3',
    processoCognitivo: ProcessoCognitivo.APLICAR,
    tipoConhecimento: TipoConhecimento.PROCEDIMENTAL,
    descricao: 'Executar procedimentos e implementar técnicas',
    exemplosContextualizados: [
      'Resolver problemas usando algoritmos',
      'Conduzir experimentos científicos',
      'Aplicar métodos de pesquisa',
      'Executar técnicas artísticas',
    ],
    verbosCaracteristicos: ['resolver', 'conduzir', 'aplicar', 'executar', 'implementar'],
  },
  {
    id: 'celula-c4',
    codigo: 'C4',
    processoCognitivo: ProcessoCognitivo.ANALISAR,
    tipoConhecimento: TipoConhecimento.PROCEDIMENTAL,
    descricao: 'Analisar procedimentos e identificar componentes',
    exemplosContextualizados: [
      'Desconstruir algoritmos em passos',
      'Comparar eficiência de métodos',
      'Identificar falhas em procedimentos',
      'Organizar técnicas por complexidade',
    ],
    verbosCaracteristicos: ['desconstruir', 'comparar', 'identificar', 'organizar', 'examinar'],
  },
  {
    id: 'celula-c5',
    codigo: 'C5',
    processoCognitivo: ProcessoCognitivo.AVALIAR,
    tipoConhecimento: TipoConhecimento.PROCEDIMENTAL,
    descricao: 'Avaliar adequação e eficiência de procedimentos',
    exemplosContextualizados: [
      'Julgar eficácia de métodos',
      'Avaliar precisão de técnicas',
      'Criticar procedimentos inadequados',
      'Testar validade de algoritmos',
    ],
    verbosCaracteristicos: ['julgar', 'avaliar', 'criticar', 'testar', 'monitorar'],
  },
  {
    id: 'celula-c6',
    codigo: 'C6',
    processoCognitivo: ProcessoCognitivo.CRIAR,
    tipoConhecimento: TipoConhecimento.PROCEDIMENTAL,
    descricao: 'Criar novos procedimentos, técnicas e métodos',
    exemplosContextualizados: [
      'Desenvolver algoritmos originais',
      'Projetar experimentos inovadores',
      'Formular novos métodos de pesquisa',
      'Produzir técnicas artísticas próprias',
    ],
    verbosCaracteristicos: ['desenvolver', 'projetar', 'formular', 'produzir', 'inventar'],
  },

  // Linha D: Conhecimento Metacognitivo
  {
    id: 'celula-d1',
    codigo: 'D1',
    processoCognitivo: ProcessoCognitivo.LEMBRAR,
    tipoConhecimento: TipoConhecimento.METACOGNITIVO,
    descricao: 'Recordar estratégias e conhecimento sobre cognição',
    exemplosContextualizados: [
      'Listar estratégias de estudo',
      'Reconhecer estilos de aprendizagem',
      'Identificar processos metacognitivos',
      'Nomear técnicas de autorregulação',
    ],
    verbosCaracteristicos: ['listar', 'reconhecer', 'identificar', 'nomear', 'relembrar'],
  },
  {
    id: 'celula-d2',
    codigo: 'D2',
    processoCognitivo: ProcessoCognitivo.ENTENDER,
    tipoConhecimento: TipoConhecimento.METACOGNITIVO,
    descricao: 'Compreender processos cognitivos e estratégias de aprendizagem',
    exemplosContextualizados: [
      'Explicar como funciona a própria aprendizagem',
      'Interpretar feedback sobre desempenho',
      'Resumir pontos fortes e fracos',
      'Comparar diferentes estratégias de estudo',
    ],
    verbosCaracteristicos: ['explicar', 'interpretar', 'resumir', 'comparar', 'refletir'],
  },
  {
    id: 'celula-d3',
    codigo: 'D3',
    processoCognitivo: ProcessoCognitivo.APLICAR,
    tipoConhecimento: TipoConhecimento.METACOGNITIVO,
    descricao: 'Aplicar estratégias metacognitivas ao próprio aprendizado',
    exemplosContextualizados: [
      'Usar técnicas de automonitoramento',
      'Aplicar estratégias de autorregulação',
      'Implementar planos de estudo personalizados',
      'Ajustar abordagens de aprendizagem',
    ],
    verbosCaracteristicos: ['usar', 'aplicar', 'implementar', 'ajustar', 'executar'],
  },
  {
    id: 'celula-d4',
    codigo: 'D4',
    processoCognitivo: ProcessoCognitivo.ANALISAR,
    tipoConhecimento: TipoConhecimento.METACOGNITIVO,
    descricao: 'Analisar próprios processos cognitivos e estratégias',
    exemplosContextualizados: [
      'Identificar padrões de erros',
      'Examinar eficácia de estratégias usadas',
      'Diferenciar abordagens eficazes e ineficazes',
      'Organizar repertório metacognitivo',
    ],
    verbosCaracteristicos: ['identificar', 'examinar', 'diferenciar', 'organizar', 'analisar'],
  },
  {
    id: 'celula-d5',
    codigo: 'D5',
    processoCognitivo: ProcessoCognitivo.AVALIAR,
    tipoConhecimento: TipoConhecimento.METACOGNITIVO,
    descricao: 'Avaliar próprio desempenho e estratégias cognitivas',
    exemplosContextualizados: [
      'Julgar eficácia do próprio aprendizado',
      'Avaliar adequação de estratégias escolhidas',
      'Criticar abordagens ineficientes',
      'Autoavaliar progresso e desenvolvimento',
    ],
    verbosCaracteristicos: ['julgar', 'avaliar', 'criticar', 'autoavaliar', 'monitorar'],
  },
  {
    id: 'celula-d6',
    codigo: 'D6',
    processoCognitivo: ProcessoCognitivo.CRIAR,
    tipoConhecimento: TipoConhecimento.METACOGNITIVO,
    descricao: 'Criar estratégias metacognitivas e planos de automonitoramento',
    exemplosContextualizados: [
      'Desenvolver plano de estudo personalizado',
      'Criar sistema de autoavaliação',
      'Gerar estratégias de resolução de problemas',
      'Formular metas de aprendizagem próprias',
    ],
    verbosCaracteristicos: ['desenvolver', 'criar', 'gerar', 'formular', 'projetar'],
  },
];

/**
 * Busca célula específica da matriz por processo e conhecimento
 *
 * @param processo - Processo cognitivo
 * @param conhecimento - Tipo de conhecimento
 * @returns Célula correspondente ou null
 */
export function getCelula(
  processo: ProcessoCognitivo,
  conhecimento: TipoConhecimento
): CelulaTaxonomica | null {
  return (
    MATRIZ_BLOOM_COMPLETA.find(
      (celula) => celula.processoCognitivo === processo && celula.tipoConhecimento === conhecimento
    ) || null
  );
}

/**
 * Busca célula por código (ex: 'B4')
 *
 * @param codigo - Código da célula (A1-D6)
 * @returns Célula correspondente ou null
 */
export function getCelulaPorCodigo(codigo: CodigoCelula): CelulaTaxonomica | null {
  return MATRIZ_BLOOM_COMPLETA.find((celula) => celula.codigo === codigo) || null;
}

/**
 * Lista todas as células de um processo cognitivo
 *
 * @param processo - Processo cognitivo
 * @returns Array de células
 */
export function listarCelulasPorProcesso(processo: ProcessoCognitivo): CelulaTaxonomica[] {
  return MATRIZ_BLOOM_COMPLETA.filter((celula) => celula.processoCognitivo === processo);
}

/**
 * Lista todas as células de um tipo de conhecimento
 *
 * @param conhecimento - Tipo de conhecimento
 * @returns Array de células
 */
export function listarCelulasPorConhecimento(conhecimento: TipoConhecimento): CelulaTaxonomica[] {
  return MATRIZ_BLOOM_COMPLETA.filter((celula) => celula.tipoConhecimento === conhecimento);
}

/**
 * Verbos de ação por processo cognitivo
 *
 * Baseado em Anderson & Krathwohl (2001) e adaptado para português.
 */
export const VERBOS_POR_PROCESSO: Record<ProcessoCognitivo, readonly string[]> = {
  [ProcessoCognitivo.LEMBRAR]: [
    'reconhecer',
    'recordar',
    'listar',
    'nomear',
    'identificar',
    'recuperar',
    'localizar',
    'memorizar',
    'relembrar',
    'rotular',
  ],
  [ProcessoCognitivo.ENTENDER]: [
    'interpretar',
    'exemplificar',
    'classificar',
    'resumir',
    'inferir',
    'comparar',
    'explicar',
    'parafrasear',
    'traduzir',
    'descrever',
    'ilustrar',
    'generalizar',
  ],
  [ProcessoCognitivo.APLICAR]: [
    'executar',
    'implementar',
    'usar',
    'demonstrar',
    'resolver',
    'aplicar',
    'empregar',
    'praticar',
    'operar',
  ],
  [ProcessoCognitivo.ANALISAR]: [
    'diferenciar',
    'organizar',
    'atribuir',
    'comparar',
    'contrastar',
    'desconstruir',
    'categorizar',
    'examinar',
    'distinguir',
    'investigar',
  ],
  [ProcessoCognitivo.AVALIAR]: [
    'checar',
    'criticar',
    'julgar',
    'avaliar',
    'testar',
    'detectar',
    'monitorar',
    'revisar',
    'verificar',
    'validar',
  ],
  [ProcessoCognitivo.CRIAR]: [
    'gerar',
    'planejar',
    'produzir',
    'projetar',
    'construir',
    'formular',
    'desenvolver',
    'inventar',
    'compor',
    'elaborar',
  ],
};

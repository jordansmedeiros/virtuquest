/**
 * Tipos compartilhados entre agregados de domínio pedagógico
 *
 * Estruturas para:
 * - Alinhamento pedagógico (BNCC × Bloom × Virtudes)
 * - Hierarquia de planejamento
 * - Validações de coerência
 * - Relações pedagógicas
 *
 * @see docs/development/SPECS.md
 */

/**
 * Níveis Hierárquicos de Planejamento
 *
 * Estrutura de 5 níveis do mais amplo ao mais específico:
 * ANO → SEMESTRE → BIMESTRE → UNIDADE → AULA
 */
export enum HierarquiaPlanejamento {
  /** Planejamento anual */
  ANO = 'ano',
  /** Planejamento semestral */
  SEMESTRE = 'semestre',
  /** Planejamento bimestral */
  BIMESTRE = 'bimestre',
  /** Unidade didática/temática */
  UNIDADE = 'unidade',
  /** Plano de aula */
  AULA = 'aula',
}

/**
 * Nível de Planejamento
 *
 * Representa um nível na hierarquia pedagógica.
 */
export interface NivelPlanejamento {
  /** Tipo de nível na hierarquia */
  readonly nivel: HierarquiaPlanejamento;
  /** Posição hierárquica (1=ANO, 5=AULA) */
  readonly ordem: number;
  /** ID do nível superior (null para ANO) */
  readonly paiId: string | null;
  /** IDs dos níveis inferiores */
  readonly filhosIds: readonly string[];
}

/**
 * Tipos de Erro de Coerência
 */
export type TipoErroCoerencia = 'hierarquia' | 'alinhamento' | 'progressao' | 'integridade';

/**
 * Severidade de Erro
 */
export type SeveridadeErro = 'critico' | 'alto' | 'medio' | 'baixo';

/**
 * Erro de Coerência
 *
 * Representa um problema de validação pedagógica.
 */
export interface ErroCoerencia {
  /** Tipo do erro */
  readonly tipo: TipoErroCoerencia;
  /** Severidade do erro */
  readonly severidade: SeveridadeErro;
  /** Mensagem descritiva */
  readonly mensagem: string;
  /** Campo/elemento afetado */
  readonly campo: string;
  /** Sugestão de correção */
  readonly sugestao: string;
}

/**
 * Aviso de Coerência
 *
 * Alerta não-bloqueante sobre possíveis melhorias.
 */
export interface AvisoCoerencia {
  /** Tipo do aviso */
  readonly tipo: string;
  /** Mensagem do aviso */
  readonly mensagem: string;
  /** Recomendação de melhoria */
  readonly recomendacao: string;
}

/**
 * Resultado de Validação de Coerência
 *
 * Contém erros, avisos e score geral de qualidade.
 */
export interface ValidacaoCoerencia {
  /** Indica se validação passou */
  readonly valido: boolean;
  /** Lista de erros encontrados */
  readonly erros: readonly ErroCoerencia[];
  /** Lista de avisos (não bloqueiam) */
  readonly avisos: readonly AvisoCoerencia[];
  /** Score de qualidade (0-100) */
  readonly score: number;
}

/**
 * Tipos de Identificadores Pedagógicos
 */
export type TipoIdentificador = 'bncc' | 'bloom' | 'virtude' | 'competencia';

/**
 * Identificador Pedagógico
 *
 * Union type para diferentes tipos de referências pedagógicas.
 */
export type IdentificadorPedagogico =
  | { readonly tipo: 'bncc'; readonly codigo: string }
  | { readonly tipo: 'bloom'; readonly codigo: string }
  | { readonly tipo: 'virtude'; readonly nome: string }
  | { readonly tipo: 'competencia'; readonly id: string };

/**
 * Tipos de Relações Pedagógicas
 */
export type TipoRelacao = 'desenvolve' | 'mobiliza' | 'requer' | 'complementa';

/**
 * Relação Pedagógica
 *
 * Representa relação entre entidades pedagógicas
 * (ex: Habilidade BNCC → desenvolve → Virtude).
 */
export interface RelacaoPedagogica {
  /** Entidade origem */
  readonly origem: IdentificadorPedagogico;
  /** Entidade destino */
  readonly destino: IdentificadorPedagogico;
  /** Tipo de relação */
  readonly tipoRelacao: TipoRelacao;
  /** Força da relação (0-1) */
  readonly forca: number;
}

/**
 * Alinhamento Pedagógico
 *
 * Representa coerência entre BNCC, Bloom e Virtudes em um plano.
 *
 * @example
 * {
 *   habilidadesBNCC: ['EF67LP08', 'EF67LP09'],
 *   celulasBloom: ['B4', 'B5'],
 *   virtudes: ['RIGOR_INTELECTUAL', 'CURIOSIDADE_INTELECTUAL'],
 *   coerenciaVertical: 85,
 *   coerenciaHorizontal: 78,
 *   gaps: ['Falta habilidade de Matemática para complementar'],
 *   recomendacoes: ['Adicionar atividade de aplicação (C3)']
 * }
 */
export interface AlinhamentoPedagogico {
  /** Códigos de habilidades BNCC */
  readonly habilidadesBNCC: readonly string[];
  /** Códigos de células Bloom (A1-D6) */
  readonly celulasBloom: readonly string[];
  /** Nomes de virtudes intelectuais */
  readonly virtudes: readonly string[];
  /** Coerência dentro de cada dimensão (0-100) */
  readonly coerenciaVertical: number;
  /** Coerência entre dimensões (0-100) */
  readonly coerenciaHorizontal: number;
  /** Lacunas identificadas */
  readonly gaps: readonly string[];
  /** Recomendações de melhoria */
  readonly recomendacoes: readonly string[];
}

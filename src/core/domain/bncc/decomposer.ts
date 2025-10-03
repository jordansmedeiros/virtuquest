/**
 * Utilitário para decomposição de códigos de habilidades BNCC
 *
 * Decompose códigos BNCC em seus componentes estruturais:
 * - Etapa (EI, EF, EM)
 * - Anos (01-09, 67, 89, etc.)
 * - Componente curricular (LP, MA, CI, etc.)
 * - Sequência da habilidade
 *
 * Padrão BNCC: ETAPA + ANOS + COMPONENTE + SEQUENCIA
 * Exemplo: EF67LP08 = EF + 67 + LP + 08
 *
 * @see docs/development/SPECS.md (linha 1880)
 */

import { Etapa, type HabilidadeDecomposta } from './types';

/**
 * Erro customizado para códigos BNCC inválidos
 */
export class InvalidBNCCCodeError extends Error {
  constructor(
    public readonly code: string,
    public readonly reason: string
  ) {
    super(`Código BNCC inválido "${code}": ${reason}`);
    this.name = 'InvalidBNCCCodeError';
  }
}

/**
 * Mapeamento de siglas de componentes para nomes completos
 */
const COMPONENTES_NOMES: Record<string, string> = {
  LP: 'Língua Portuguesa',
  MA: 'Matemática',
  CI: 'Ciências',
  GE: 'Geografia',
  HI: 'História',
  AR: 'Arte',
  EF: 'Educação Física',
  ER: 'Ensino Religioso',
  LI: 'Língua Inglesa',
  CNT: 'Ciências da Natureza e suas Tecnologias',
  CHS: 'Ciências Humanas e Sociais Aplicadas',
  LGG: 'Linguagens e suas Tecnologias',
  MAT: 'Matemática e suas Tecnologias',
};

/**
 * Regex para validação de código BNCC
 * Grupos: (ETAPA)(ANOS)(COMPONENTE)(SEQUENCIA)
 * Exemplo: EF67LP08 → EF, 67, LP, 08
 */
const BNCC_CODE_REGEX = /^([A-Z]{2})(\d{2})([A-Z]{2,3})(\d{2,3})$/;

/**
 * Decompõe código BNCC em componentes estruturais
 *
 * @param codigo - Código BNCC (ex: 'EF67LP08', 'EM13CNT101')
 * @returns Objeto com etapa, anos, componente e sequência
 * @throws {InvalidBNCCCodeError} Se código não seguir padrão BNCC
 *
 * @example
 * decomposeCodigoHabilidade('EF67LP08')
 * // {
 * //   etapa: Etapa.EF,
 * //   anos: [6, 7],
 * //   componente: 'LP',
 * //   sequencia: 8,
 * //   codigoOriginal: 'EF67LP08'
 * // }
 *
 * @example
 * decomposeCodigoHabilidade('EM13CNT101')
 * // {
 * //   etapa: Etapa.EM,
 * //   anos: [1, 2, 3],
 * //   componente: 'CNT',
 * //   sequencia: 101,
 * //   codigoOriginal: 'EM13CNT101'
 * // }
 */
export function decomposeCodigoHabilidade(codigo: string): HabilidadeDecomposta {
  const match = codigo.match(BNCC_CODE_REGEX);

  if (!match) {
    throw new InvalidBNCCCodeError(
      codigo,
      'Formato inválido. Esperado: ETAPA + ANOS + COMPONENTE + SEQUENCIA (ex: EF67LP08)'
    );
  }

  const [, etapaStr, anosStr, componente, sequenciaStr] = match;

  // Validar etapa
  if (!Object.values(Etapa).includes(etapaStr as Etapa)) {
    throw new InvalidBNCCCodeError(codigo, `Etapa inválida "${etapaStr}". Esperado: EI, EF ou EM`);
  }
  const etapa = etapaStr as Etapa;

  // Validar componente curricular
  if (!COMPONENTES_NOMES[componente]) {
    throw new InvalidBNCCCodeError(codigo, `Componente curricular desconhecido: "${componente}"`);
  }

  // Extrair anos
  const anos = extrairAnos(anosStr, etapa);

  // Extrair sequência
  const sequencia = parseInt(sequenciaStr, 10);

  return {
    etapa,
    anos,
    componente,
    sequencia,
    codigoOriginal: codigo,
  };
}

/**
 * Extrai array de anos a partir de string de 2 dígitos
 *
 * Lógica:
 * - '01' → [1]
 * - '67' → [6, 7]
 * - '89' → [8, 9]
 * - '13' → [1, 2, 3] (para EM, representa todas as séries)
 *
 * @param anosStr - String com 2 dígitos representando anos
 * @param etapa - Etapa para validação de anos
 * @returns Array de anos
 */
function extrairAnos(anosStr: string, etapa: Etapa): number[] {
  const primeiroDigito = parseInt(anosStr[0], 10);
  const segundoDigito = parseInt(anosStr[1], 10);

  // Educação Infantil: creche e pré-escola
  if (etapa === Etapa.EI) {
    // Formato EI02 = creche 0-2 anos, EI03 = pré-escola 3 anos, etc.
    return [primeiroDigito, segundoDigito];
  }

  // Ensino Médio: caso especial para códigos como EM13 (todas as 3 séries)
  if (etapa === Etapa.EM) {
    if (anosStr === '13') {
      return [1, 2, 3]; // Todas as séries do EM
    }
    // Casos como EM12 = 1ª e 2ª série
    if (primeiroDigito !== segundoDigito) {
      const anos: number[] = [];
      for (let i = primeiroDigito; i <= segundoDigito; i++) {
        anos.push(i);
      }
      return anos;
    }
    return [primeiroDigito];
  }

  // Ensino Fundamental
  // Se dígitos iguais (ex: '11'), retorna array com um elemento
  if (primeiroDigito === segundoDigito) {
    return [primeiroDigito];
  }

  // Se dígitos consecutivos (ex: '67'), retorna ambos
  return [primeiroDigito, segundoDigito];
}

/**
 * Valida se código segue padrão BNCC
 *
 * @param codigo - Código a validar
 * @returns true se válido, false caso contrário
 *
 * @example
 * validarCodigoBNCC('EF67LP08') // true
 * validarCodigoBNCC('INVALID') // false
 */
export function validarCodigoBNCC(codigo: string): boolean {
  try {
    decomposeCodigoHabilidade(codigo);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtém nome completo do componente curricular a partir da sigla
 *
 * @param sigla - Sigla do componente (ex: 'LP', 'MA', 'CNT')
 * @returns Nome completo do componente
 *
 * @example
 * getComponenteNome('LP') // 'Língua Portuguesa'
 * getComponenteNome('CNT') // 'Ciências da Natureza e suas Tecnologias'
 */
export function getComponenteNome(sigla: string): string {
  return COMPONENTES_NOMES[sigla] || sigla;
}

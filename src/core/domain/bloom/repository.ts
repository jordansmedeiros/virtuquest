/**
 * Repositório Estático para Catálogo Bloom
 *
 * Fornece acesso imutável a:
 * - 6 processos cognitivos com verbos
 * - 4 tipos de conhecimento
 * - 24 células da matriz taxonômica
 * - Índice reverso de verbos para classificação
 *
 * @see docs/fundamentos/COMPETENCIAS_BLOOM_TAXONOMIA.md
 */

import { ProcessoCognitivo, TipoConhecimento, type CelulaTaxonomica } from './types';
import {
  MATRIZ_BLOOM_COMPLETA,
  getCelula,
  getCelulaPorCodigo,
  VERBOS_POR_PROCESSO,
} from './matriz';

/**
 * Repositório de Catálogo Bloom (Singleton, Imutável)
 */
class CatalogoBloomRepository {
  private readonly verbosAcao: Map<string, ProcessoCognitivo>;

  constructor() {
    this.verbosAcao = new Map();
    this.construirIndiceVerbos();
  }

  /**
   * Constrói índice reverso: verbo → processo cognitivo
   */
  private construirIndiceVerbos(): void {
    Object.entries(VERBOS_POR_PROCESSO).forEach(([processoStr, verbos]) => {
      const processo = parseInt(processoStr) as ProcessoCognitivo;
      verbos.forEach((verbo) => {
        this.verbosAcao.set(this.normalizarVerbo(verbo), processo);
      });
    });
  }

  /**
   * Normaliza verbo para busca (lowercase, sem acentos)
   */
  private normalizarVerbo(verbo: string): string {
    return verbo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // === Métodos de Consulta ===

  getCelula(processo: ProcessoCognitivo, conhecimento: TipoConhecimento): CelulaTaxonomica | null {
    return getCelula(processo, conhecimento);
  }

  getCelulaPorCodigo(codigo: string): CelulaTaxonomica | null {
    return getCelulaPorCodigo(codigo as any);
  }

  listarCelulas(): CelulaTaxonomica[] {
    return [...MATRIZ_BLOOM_COMPLETA];
  }

  getVerbosPorProcesso(processo: ProcessoCognitivo): string[] {
    return [...(VERBOS_POR_PROCESSO[processo] || [])];
  }

  /**
   * Identifica processo cognitivo a partir de verbo
   *
   * @param verbo - Verbo no infinitivo
   * @returns Processo cognitivo ou null
   *
   * @example
   * identificarProcessoPorVerbo('analisar') // ProcessoCognitivo.ANALISAR
   * identificarProcessoPorVerbo('comparar') // ProcessoCognitivo.ANALISAR
   */
  identificarProcessoPorVerbo(verbo: string): ProcessoCognitivo | null {
    const verboNormalizado = this.normalizarVerbo(verbo);
    return this.verbosAcao.get(verboNormalizado) || null;
  }

  // === Métodos de Análise ===

  /**
   * Calcula complexidade cognitiva média de uma sequência de processos
   *
   * @param processos - Array de processos cognitivos
   * @returns Score de complexidade (1-6)
   */
  calcularComplexidadeCognitiva(processos: ProcessoCognitivo[]): number {
    if (processos.length === 0) return 0;

    const soma = processos.reduce((acc, p) => acc + p, 0);
    return soma / processos.length;
  }

  /**
   * Sugere progressão cognitiva a partir de processo atual
   *
   * @param processoAtual - Processo cognitivo de partida
   * @returns Sequência de progressão recomendada
   */
  sugerirProgressao(processoAtual: ProcessoCognitivo): ProcessoCognitivo[] {
    const progressao: ProcessoCognitivo[] = [];

    for (let p = processoAtual + 1; p <= ProcessoCognitivo.CRIAR; p++) {
      progressao.push(p as ProcessoCognitivo);
    }

    return progressao;
  }

  /**
   * Valida se progressão de processos é lógica
   *
   * @param processos - Sequência de processos
   * @returns Objeto com validação e problemas identificados
   */
  validarProgressao(processos: ProcessoCognitivo[]): { valida: boolean; problemas: string[] } {
    const problemas: string[] = [];

    if (processos.length === 0) {
      return { valida: true, problemas };
    }

    // Verificar saltos muito grandes (mais de 2 níveis)
    for (let i = 0; i < processos.length - 1; i++) {
      const atual = processos[i];
      const proximo = processos[i + 1];

      if (atual === undefined || proximo === undefined) continue;

      const salto = proximo - atual;

      if (salto > 2) {
        problemas.push(
          `Salto cognitivo muito grande entre ${this.getNomeProcesso(atual)} e ${this.getNomeProcesso(proximo)}`
        );
      }

      if (salto < 0) {
        problemas.push(
          `Regressão cognitiva de ${this.getNomeProcesso(atual)} para ${this.getNomeProcesso(proximo)}`
        );
      }
    }

    return {
      valida: problemas.length === 0,
      problemas,
    };
  }

  private getNomeProcesso(processo: ProcessoCognitivo): string {
    const nomes: Record<ProcessoCognitivo, string> = {
      [ProcessoCognitivo.LEMBRAR]: 'Lembrar',
      [ProcessoCognitivo.ENTENDER]: 'Entender',
      [ProcessoCognitivo.APLICAR]: 'Aplicar',
      [ProcessoCognitivo.ANALISAR]: 'Analisar',
      [ProcessoCognitivo.AVALIAR]: 'Avaliar',
      [ProcessoCognitivo.CRIAR]: 'Criar',
    };
    return nomes[processo];
  }
}

/**
 * Instância singleton do catálogo Bloom
 */
export const catalogoBloom = new CatalogoBloomRepository();

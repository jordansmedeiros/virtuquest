/**
 * Mapeadores de Coerência Pedagógica
 *
 * Implementa mapeamentos bidirecionais entre:
 * - BNCC → Bloom (habilidades para processos cognitivos)
 * - Bloom → Virtudes (processos para virtudes intelectuais)
 * - BNCC → Virtudes (competências para virtudes)
 * - Perrenoud → Bloom (competências para processos)
 *
 * @see docs/development/SPECS.md (seções 1.1-1.4, 2.1-2.2)
 */

import type { AlinhamentoPedagogico } from './types';
import type { Habilidade } from '../bncc/types';
import type { ProcessoCognitivo, CelulaTaxonomica } from '../bloom/types';
import { TipoConhecimento } from '../bloom/types';
import type { VirtudeIntelectual } from '../virtudes/types';
import { catalogoBNCC } from '../bncc/repository';
import { catalogoBloom } from '../bloom/repository';
import { catalogoVirtudes } from '../virtudes/repository';
import { catalogoPerrenoud } from '../perrenoud/repository';

/**
 * Resultado de Mapeamento BNCC → Bloom
 */
export interface MapeamentoBNCCBloom {
  /** Código da habilidade BNCC */
  readonly codigoHabilidade: string;
  /** Célula taxonômica principal */
  readonly celulaPrincipal: CelulaTaxonomica;
  /** Células secundárias (se houver) */
  readonly celulasSecundarias: readonly CelulaTaxonomica[];
  /** Confiança do mapeamento (0-1) */
  readonly confianca: number;
}

/**
 * Resultado de Mapeamento Bloom → Virtudes
 */
export interface MapeamentoBloomVirtudes {
  /** Processo cognitivo */
  readonly processo: ProcessoCognitivo;
  /** Virtudes relacionadas */
  readonly virtudes: readonly VirtudeIntelectual[];
  /** Força da relação (0-1) */
  readonly forca: number;
}

/**
 * Mapeador BNCC → Bloom
 *
 * Mapeia habilidades BNCC para células da Taxonomia de Bloom
 */
export class MapeadorBNCCBloom {
  /**
   * Mapeia habilidade BNCC para célula(s) taxonômica(s)
   *
   * Analisa a descrição da habilidade para identificar:
   * - Verbo nuclear (processo cognitivo)
   * - Tipo de conhecimento envolvido
   */
  mapear(codigoHabilidade: string): MapeamentoBNCCBloom | null {
    const habilidade = catalogoBNCC.getHabilidade(codigoHabilidade);
    if (!habilidade) return null;

    // Extrai verbo nuclear
    const verbo = this.extrairVerboNuclear(habilidade.descricao);
    const processo = catalogoBloom.identificarProcessoPorVerbo(verbo);

    if (!processo) {
      // Fallback: tenta processos mais comuns
      return this.mapearComFallback(habilidade);
    }

    // Identifica tipo de conhecimento
    const tipoConhecimento = this.identificarTipoConhecimento(habilidade);

    // Busca célula principal
    const celulaPrincipal = catalogoBloom.getCelula(processo, tipoConhecimento);
    if (!celulaPrincipal) {
      return this.mapearComFallback(habilidade);
    }

    // Identifica células secundárias (verbos adicionais na descrição)
    const celulasSecundarias = this.identificarCelulasSecundarias(habilidade, celulaPrincipal);

    return {
      codigoHabilidade,
      celulaPrincipal,
      celulasSecundarias,
      confianca: 0.85, // Alta confiança quando verbo é encontrado
    };
  }

  /**
   * Mapeia múltiplas habilidades de uma vez
   */
  mapearMultiplas(codigosHabilidades: string[]): MapeamentoBNCCBloom[] {
    return codigosHabilidades
      .map((codigo) => this.mapear(codigo))
      .filter((m): m is MapeamentoBNCCBloom => m !== null);
  }

  /**
   * Extrai verbo nuclear da descrição
   */
  private extrairVerboNuclear(descricao: string): string {
    // Remove parênteses e conteúdo entre parênteses
    const limpa = descricao.replace(/\([^)]*\)/g, '').trim();

    // Pega primeira palavra (geralmente o verbo nuclear)
    const palavras = limpa.split(/\s+/);
    return palavras[0]?.toLowerCase() || '';
  }

  /**
   * Identifica tipo de conhecimento baseado em palavras-chave
   */
  private identificarTipoConhecimento(habilidade: Habilidade): TipoConhecimento {
    const descricao = habilidade.descricao.toLowerCase();

    // Tipo de conhecimento é inferido por palavras-chave
    // A = Factual, B = Conceitual, C = Procedimental, D = Metacognitivo

    if (
      descricao.includes('planejar') ||
      descricao.includes('estratégia') ||
      descricao.includes('autorregulaç')
    ) {
      return TipoConhecimento.METACOGNITIVO;
    }

    if (
      descricao.includes('procedimento') ||
      descricao.includes('técnica') ||
      descricao.includes('método') ||
      descricao.includes('processo')
    ) {
      return TipoConhecimento.PROCEDIMENTAL;
    }

    if (
      descricao.includes('conceito') ||
      descricao.includes('princípio') ||
      descricao.includes('teoria') ||
      descricao.includes('relação')
    ) {
      return TipoConhecimento.CONCEITUAL;
    }

    // Default: conceitual (mais comum em habilidades BNCC)
    return TipoConhecimento.CONCEITUAL;
  }

  /**
   * Identifica células secundárias (verbos adicionais)
   */
  private identificarCelulasSecundarias(
    habilidade: Habilidade,
    celulaPrincipal: CelulaTaxonomica
  ): CelulaTaxonomica[] {
    const secundarias: CelulaTaxonomica[] = [];
    const palavras = habilidade.descricao.toLowerCase().split(/\s+/);

    for (const palavra of palavras) {
      const processo = catalogoBloom.identificarProcessoPorVerbo(palavra);
      if (processo && processo !== celulaPrincipal.processoCognitivo) {
        const celula = catalogoBloom.getCelula(processo, celulaPrincipal.tipoConhecimento);
        if (celula && !secundarias.some((c) => c.codigo === celula.codigo)) {
          secundarias.push(celula);
        }
      }
    }

    return secundarias;
  }

  /**
   * Mapeamento com fallback quando verbo não é identificado
   */
  private mapearComFallback(habilidade: Habilidade): MapeamentoBNCCBloom | null {
    // Usa processo ENTENDER como padrão (nível 2)
    const celulaPadrao = catalogoBloom.getCelula(2, TipoConhecimento.CONCEITUAL);
    if (!celulaPadrao) return null;

    return {
      codigoHabilidade: habilidade.codigo,
      celulaPrincipal: celulaPadrao,
      celulasSecundarias: [],
      confianca: 0.5, // Baixa confiança em fallback
    };
  }
}

/**
 * Mapeador Bloom → Virtudes
 *
 * Mapeia processos cognitivos para virtudes intelectuais relacionadas
 */
export class MapeadorBloomVirtudes {
  /**
   * Mapeia processo cognitivo para virtudes
   */
  mapear(processo: ProcessoCognitivo): MapeamentoBloomVirtudes {
    const todasVirtudes = catalogoVirtudes.listarVirtudes();

    const virtudesRelacionadas = todasVirtudes.filter((v) =>
      v.processosBloomRelacionados.includes(processo)
    );

    // Calcula força da relação baseado em quantos processos a virtude cobre
    const forca =
      virtudesRelacionadas.length > 0
        ? virtudesRelacionadas.reduce((acc, v) => {
            const peso = 1 / v.processosBloomRelacionados.length;
            return acc + peso;
          }, 0) / virtudesRelacionadas.length
        : 0;

    return {
      processo,
      virtudes: virtudesRelacionadas,
      forca: Math.min(1, forca),
    };
  }

  /**
   * Mapeia múltiplos processos cognitivos
   */
  mapearMultiplos(processos: ProcessoCognitivo[]): Map<ProcessoCognitivo, VirtudeIntelectual[]> {
    const mapa = new Map<ProcessoCognitivo, VirtudeIntelectual[]>();

    for (const processo of processos) {
      const mapeamento = this.mapear(processo);
      mapa.set(processo, [...mapeamento.virtudes]);
    }

    return mapa;
  }

  /**
   * Sugere virtudes para um conjunto de processos cognitivos
   */
  sugerirVirtudes(processos: ProcessoCognitivo[]): VirtudeIntelectual[] {
    const virtudesPorFrequencia = new Map<string, { virtude: VirtudeIntelectual; count: number }>();

    for (const processo of processos) {
      const mapeamento = this.mapear(processo);
      for (const virtude of mapeamento.virtudes) {
        const existente = virtudesPorFrequencia.get(virtude.id);
        if (existente) {
          existente.count++;
        } else {
          virtudesPorFrequencia.set(virtude.id, { virtude, count: 1 });
        }
      }
    }

    // Ordena por frequência e retorna
    return Array.from(virtudesPorFrequencia.values())
      .sort((a, b) => b.count - a.count)
      .map((item) => item.virtude);
  }
}

/**
 * Mapeador Perrenoud → Bloom
 *
 * Mapeia competências de Perrenoud para processos cognitivos
 */
export class MapeadorPerrenoudBloom {
  /**
   * Extrai processos cognitivos de uma competência Perrenoud
   */
  extrairProcessos(competenciaId: string): ProcessoCognitivo[] {
    const competencia = catalogoPerrenoud.getCompetencia(competenciaId);
    if (!competencia) return [];

    // Coleta processos das situações-problema da competência
    const processos = new Set<ProcessoCognitivo>();

    for (const situacao of competencia.situacoesFamilia) {
      situacao.processosRequeridos.forEach((p) => processos.add(p));
    }

    // Coleta processos dos esquemas de mobilização
    for (const esquema of competencia.esquemasMobilizacao) {
      esquema.passos.forEach((passo) => processos.add(passo.processoCognitivo));
    }

    return Array.from(processos).sort((a, b) => a - b);
  }

  /**
   * Mapeia competência para células taxonômicas
   */
  mapearParaCelulas(competenciaId: string): CelulaTaxonomica[] {
    const processos = this.extrairProcessos(competenciaId);
    const celulas: CelulaTaxonomica[] = [];

    // Para cada processo, busca células em diferentes tipos de conhecimento
    const tiposConhecimento: TipoConhecimento[] = [
      TipoConhecimento.FACTUAL,
      TipoConhecimento.CONCEITUAL,
      TipoConhecimento.PROCEDIMENTAL,
      TipoConhecimento.METACOGNITIVO,
    ];
    for (const processo of processos) {
      for (const tipoConhecimento of tiposConhecimento) {
        const celula = catalogoBloom.getCelula(processo, tipoConhecimento);
        if (celula) {
          celulas.push(celula);
        }
      }
    }

    return celulas;
  }
}

/**
 * Construtor de Alinhamento Pedagógico Integrado
 */
export class ConstrutorAlinhamento {
  private mapeadorBNCCBloom = new MapeadorBNCCBloom();
  private mapeadorBloomVirtudes = new MapeadorBloomVirtudes();

  /**
   * Constrói alinhamento pedagógico completo a partir de habilidades BNCC
   */
  construirAlinhamento(codigosHabilidades: string[]): AlinhamentoPedagogico {
    // Mapeia BNCC → Bloom
    const mapeamentosBNCCBloom = this.mapeadorBNCCBloom.mapearMultiplas(codigosHabilidades);

    // Extrai células Bloom
    const celulasBloom = mapeamentosBNCCBloom.map((m) => m.celulaPrincipal.codigo);
    const processos = mapeamentosBNCCBloom.map((m) => m.celulaPrincipal.processoCognitivo);

    // Mapeia Bloom → Virtudes
    const virtudesSugeridas = this.mapeadorBloomVirtudes.sugerirVirtudes(processos);
    const virtudesIds = virtudesSugeridas.slice(0, 3).map((v) => v.id); // Top 3

    // Calcula coerência vertical (dentro de cada dimensão)
    const coerenciaVertical = this.calcularCoerenciaVertical(mapeamentosBNCCBloom);

    // Calcula coerência horizontal (entre dimensões)
    const coerenciaHorizontal = this.calcularCoerenciaHorizontal(
      mapeamentosBNCCBloom,
      virtudesSugeridas
    );

    // Identifica gaps e recomendações
    const gaps = this.identificarGaps(processos, virtudesSugeridas);
    const recomendacoes = this.gerarRecomendacoes(processos, gaps);

    return {
      habilidadesBNCC: codigosHabilidades,
      celulasBloom,
      virtudes: virtudesIds,
      coerenciaVertical,
      coerenciaHorizontal,
      gaps,
      recomendacoes,
    };
  }

  /**
   * Calcula coerência vertical (consistência dentro de cada dimensão)
   */
  private calcularCoerenciaVertical(mapeamentos: MapeamentoBNCCBloom[]): number {
    if (mapeamentos.length === 0) return 0;

    // Média de confiança dos mapeamentos
    const confianciaMedia =
      mapeamentos.reduce((acc, m) => acc + m.confianca, 0) / mapeamentos.length;

    return Math.round(confianciaMedia * 100);
  }

  /**
   * Calcula coerência horizontal (alinhamento entre dimensões)
   */
  private calcularCoerenciaHorizontal(
    mapeamentos: MapeamentoBNCCBloom[],
    virtudes: VirtudeIntelectual[]
  ): number {
    if (mapeamentos.length === 0 || virtudes.length === 0) return 0;

    // Verifica quantas virtudes estão alinhadas com os processos
    const processos = mapeamentos.map((m) => m.celulaPrincipal.processoCognitivo);
    const processosUnicos = new Set(processos);

    let virtudesAlinhadas = 0;
    for (const virtude of virtudes) {
      const temOverlap = virtude.processosBloomRelacionados.some((p) => processosUnicos.has(p));
      if (temOverlap) virtudesAlinhadas++;
    }

    const proporcaoAlinhada = virtudes.length > 0 ? virtudesAlinhadas / virtudes.length : 0;
    return Math.round(proporcaoAlinhada * 100);
  }

  /**
   * Identifica lacunas no alinhamento
   */
  private identificarGaps(
    processos: ProcessoCognitivo[],
    virtudes: VirtudeIntelectual[]
  ): string[] {
    const gaps: string[] = [];

    // Verifica se há processos de ordem superior
    const temProcessosSuperior = processos.some((p) => p >= 4); // Analisar, Avaliar, Criar
    if (!temProcessosSuperior) {
      gaps.push('Ausência de processos cognitivos de ordem superior (Analisar, Avaliar, Criar)');
    }

    // Verifica se há virtudes suficientes
    if (virtudes.length < 2) {
      gaps.push('Poucas virtudes intelectuais mobilizadas (recomendado: pelo menos 2)');
    }

    // Verifica progressão cognitiva
    const processosOrdenados = [...processos].sort((a, b) => a - b);
    const amplitude = processosOrdenados[processosOrdenados.length - 1]! - processosOrdenados[0]!;
    if (amplitude < 2) {
      gaps.push('Baixa amplitude de complexidade cognitiva');
    }

    return gaps;
  }

  /**
   * Gera recomendações de melhoria
   */
  private gerarRecomendacoes(processos: ProcessoCognitivo[], gaps: string[]): string[] {
    const recomendacoes: string[] = [];

    if (gaps.some((g) => g.includes('ordem superior'))) {
      recomendacoes.push('Adicionar atividades de análise crítica, avaliação ou criação');
    }

    if (gaps.some((g) => g.includes('virtudes'))) {
      recomendacoes.push(
        'Explicitar estratégias de desenvolvimento de virtudes intelectuais no plano'
      );
    }

    if (gaps.some((g) => g.includes('amplitude'))) {
      recomendacoes.push(
        'Criar progressão pedagógica com atividades de diferentes níveis de complexidade'
      );
    }

    // Verifica se não há processo CRIAR
    if (!processos.includes(6)) {
      recomendacoes.push(
        'Considerar incluir atividade de produção/criação como culminância da aprendizagem'
      );
    }

    return recomendacoes;
  }
}

/**
 * Instâncias exportadas dos mapeadores
 */
export const mapeadorBNCCBloom = new MapeadorBNCCBloom();
export const mapeadorBloomVirtudes = new MapeadorBloomVirtudes();
export const mapeadorPerrenoudBloom = new MapeadorPerrenoudBloom();
export const construtorAlinhamento = new ConstrutorAlinhamento();

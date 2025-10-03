/**
 * Validadores de Coerência Pedagógica
 *
 * Implementa validações de alinhamento entre:
 * - Hierarquia de planejamento (ANO → SEMESTRE → BIMESTRE → UNIDADE → AULA)
 * - BNCC ↔ Bloom ↔ Virtudes ↔ Perrenoud
 * - Progressão cognitiva e pedagógica
 *
 * @see docs/development/SPECS.md (seções 1.1-1.4, 2.1-2.2)
 */

import type {
  ValidacaoCoerencia,
  ErroCoerencia,
  AvisoCoerencia,
  AlinhamentoPedagogico,
  SeveridadeErro,
} from './types';
import { HierarquiaPlanejamento } from './types';
import type { ProcessoCognitivo } from '../bloom/types';
import type { MomentoDidatico } from '../perrenoud/types';
import { catalogoBNCC } from '../bncc/repository';
import { catalogoBloom } from '../bloom/repository';
import { catalogoVirtudes } from '../virtudes/repository';

/**
 * Regras de hierarquia de planejamento
 * Define quais níveis podem agregar quais níveis inferiores
 */
const REGRAS_HIERARQUIA: Record<HierarquiaPlanejamento, HierarquiaPlanejamento[]> = {
  [HierarquiaPlanejamento.ANO]: [HierarquiaPlanejamento.SEMESTRE, HierarquiaPlanejamento.BIMESTRE],
  [HierarquiaPlanejamento.SEMESTRE]: [
    HierarquiaPlanejamento.BIMESTRE,
    HierarquiaPlanejamento.UNIDADE,
  ],
  [HierarquiaPlanejamento.BIMESTRE]: [HierarquiaPlanejamento.UNIDADE, HierarquiaPlanejamento.AULA],
  [HierarquiaPlanejamento.UNIDADE]: [HierarquiaPlanejamento.AULA],
  [HierarquiaPlanejamento.AULA]: [],
};

/**
 * Validador de Hierarquia de Planejamento
 */
export class ValidadorHierarquia {
  /**
   * Valida se um nível pode conter outro nível
   */
  validarAgregacao(
    nivelPai: HierarquiaPlanejamento,
    nivelFilho: HierarquiaPlanejamento
  ): ValidacaoCoerencia {
    const erros: ErroCoerencia[] = [];
    const avisos: AvisoCoerencia[] = [];

    const niveisPermitidos = REGRAS_HIERARQUIA[nivelPai];

    if (!niveisPermitidos.includes(nivelFilho)) {
      erros.push({
        tipo: 'hierarquia',
        severidade: 'critico',
        mensagem: `Nível ${nivelPai} não pode conter nível ${nivelFilho}`,
        campo: 'hierarquia',
        sugestao: `Use um dos níveis permitidos: ${niveisPermitidos.join(', ')}`,
      });
    }

    return {
      valido: erros.length === 0,
      erros,
      avisos,
      score: erros.length === 0 ? 100 : 0,
    };
  }

  /**
   * Valida consistência de uma cadeia hierárquica
   */
  validarCadeiaHierarquica(niveis: HierarquiaPlanejamento[]): ValidacaoCoerencia {
    const erros: ErroCoerencia[] = [];
    const avisos: AvisoCoerencia[] = [];

    for (let i = 0; i < niveis.length - 1; i++) {
      const resultado = this.validarAgregacao(niveis[i]!, niveis[i + 1]!);
      erros.push(...resultado.erros);
      avisos.push(...resultado.avisos);
    }

    return {
      valido: erros.length === 0,
      erros,
      avisos,
      score: erros.length === 0 ? 100 : Math.max(0, 100 - erros.length * 25),
    };
  }
}

/**
 * Validador de Alinhamento BNCC ↔ Bloom
 */
export class ValidadorBNCCBloom {
  /**
   * Valida se processos cognitivos são adequados para habilidades BNCC
   */
  validarProcessosCognitivos(
    habilidades: string[],
    processos: ProcessoCognitivo[]
  ): ValidacaoCoerencia {
    const erros: ErroCoerencia[] = [];
    const avisos: AvisoCoerencia[] = [];

    // Verifica se há pelo menos uma habilidade
    if (habilidades.length === 0) {
      erros.push({
        tipo: 'alinhamento',
        severidade: 'critico',
        mensagem: 'Nenhuma habilidade BNCC foi especificada',
        campo: 'habilidadesBNCC',
        sugestao: 'Adicione pelo menos uma habilidade BNCC ao plano',
      });
    }

    // Verifica se há pelo menos um processo cognitivo
    if (processos.length === 0) {
      erros.push({
        tipo: 'alinhamento',
        severidade: 'critico',
        mensagem: 'Nenhum processo cognitivo foi especificado',
        campo: 'processosCognitivos',
        sugestao: 'Defina pelo menos um objetivo de aprendizagem usando a Taxonomia de Bloom',
      });
    }

    // Analisa cada habilidade
    for (const codigoHabilidade of habilidades) {
      const habilidade = catalogoBNCC.getHabilidade(codigoHabilidade);

      if (!habilidade) {
        erros.push({
          tipo: 'integridade',
          severidade: 'alto',
          mensagem: `Habilidade ${codigoHabilidade} não encontrada no catálogo BNCC`,
          campo: 'habilidadesBNCC',
          sugestao: 'Verifique se o código da habilidade está correto',
        });
        continue;
      }

      // Verifica complexidade cognitiva
      const processoMaximo = Math.max(...processos);
      const verboHabilidade = this.extrairVerbo(habilidade.descricao);
      const processoSugerido = catalogoBloom.identificarProcessoPorVerbo(verboHabilidade);

      if (processoSugerido && processoMaximo < processoSugerido) {
        avisos.push({
          tipo: 'alinhamento',
          mensagem: `A habilidade ${codigoHabilidade} sugere processo "${verboHabilidade}" (nível ${processoSugerido}), mas o nível máximo do plano é ${processoMaximo}`,
          recomendacao: `Considere adicionar atividades de nível ${processoSugerido} para melhor alinhamento`,
        });
      }
    }

    const score = this.calcularScore(erros, avisos);

    return {
      valido: erros.length === 0,
      erros,
      avisos,
      score,
    };
  }

  /**
   * Extrai verbo nuclear da descrição de habilidade
   */
  private extrairVerbo(descricao: string): string {
    // Simplificação: pega primeira palavra (verbos geralmente iniciam as habilidades)
    const palavras = descricao.trim().split(/\s+/);
    return palavras[0]?.toLowerCase() || '';
  }

  /**
   * Calcula score de qualidade (0-100)
   */
  private calcularScore(erros: ErroCoerencia[], avisos: AvisoCoerencia[]): number {
    if (erros.length === 0 && avisos.length === 0) return 100;

    const pesoErro: Record<SeveridadeErro, number> = {
      critico: 30,
      alto: 20,
      medio: 10,
      baixo: 5,
    };

    const penalidade = erros.reduce((acc, erro) => acc + pesoErro[erro.severidade], 0);
    const penalAvisos = avisos.length * 3;

    return Math.max(0, 100 - penalidade - penalAvisos);
  }
}

/**
 * Validador de Alinhamento Bloom ↔ Virtudes
 */
export class ValidadorBloomVirtudes {
  /**
   * Valida se virtudes são adequadas para processos cognitivos
   */
  validarAlinhamento(processos: ProcessoCognitivo[], virtudes: string[]): ValidacaoCoerencia {
    const erros: ErroCoerencia[] = [];
    const avisos: AvisoCoerencia[] = [];

    // Deve ter pelo menos uma virtude
    if (virtudes.length === 0) {
      avisos.push({
        tipo: 'alinhamento',
        mensagem: 'Nenhuma virtude intelectual foi especificada',
        recomendacao: 'Considere adicionar pelo menos uma virtude intelectual ao plano',
      });
    }

    // Verifica alinhamento de cada virtude
    for (const virtudeId of virtudes) {
      const virtude = catalogoVirtudes.getVirtude(virtudeId);

      if (!virtude) {
        erros.push({
          tipo: 'integridade',
          severidade: 'medio',
          mensagem: `Virtude ${virtudeId} não encontrada no catálogo`,
          campo: 'virtudes',
          sugestao: 'Verifique se o identificador da virtude está correto',
        });
        continue;
      }

      // Verifica se há overlap entre processos cognitivos
      const processosVirtude = virtude.processosBloomRelacionados;
      const temOverlap = processos.some((p) => processosVirtude.includes(p));

      if (!temOverlap) {
        avisos.push({
          tipo: 'alinhamento',
          mensagem: `A virtude "${virtude.nome}" está relacionada a processos ${processosVirtude.join(', ')}, mas o plano foca em ${processos.join(', ')}`,
          recomendacao: `Considere adicionar atividades que mobilizem processos ${processosVirtude.join(', ')} ou escolher outra virtude`,
        });
      }
    }

    // Verifica cobertura de processos
    const processosComVirtude = new Set<ProcessoCognitivo>();
    for (const virtudeId of virtudes) {
      const virtude = catalogoVirtudes.getVirtude(virtudeId);
      virtude?.processosBloomRelacionados.forEach((p) => processosComVirtude.add(p));
    }

    const processosSemVirtude = processos.filter((p) => !processosComVirtude.has(p));
    if (processosSemVirtude.length > 0 && virtudes.length > 0) {
      avisos.push({
        tipo: 'alinhamento',
        mensagem: `Os processos ${processosSemVirtude.join(', ')} não estão cobertos pelas virtudes selecionadas`,
        recomendacao: 'Considere adicionar virtudes que se relacionem com esses processos',
      });
    }

    const score =
      erros.length === 0 && avisos.length === 0
        ? 100
        : Math.max(0, 100 - erros.length * 15 - avisos.length * 5);

    return {
      valido: erros.length === 0,
      erros,
      avisos,
      score,
    };
  }
}

/**
 * Validador de Progressão Pedagógica (Perrenoud)
 */
export class ValidadorProgressaoPerrenoud {
  /**
   * Valida progressão através dos 4 momentos didáticos
   */
  validarProgressaoMomentos(momentos: MomentoDidatico[]): ValidacaoCoerencia {
    const erros: ErroCoerencia[] = [];
    const avisos: AvisoCoerencia[] = [];

    // Ordem esperada dos momentos
    const ordemEsperada: MomentoDidatico[] = [
      'apropriacao',
      'aplicacao_guiada',
      'analise_avaliacao',
      'criacao',
    ];

    // Verifica se há pelo menos um momento
    if (momentos.length === 0) {
      erros.push({
        tipo: 'progressao',
        severidade: 'critico',
        mensagem: 'Nenhum momento didático foi definido',
        campo: 'momentos',
        sugestao: 'Defina a sequência de momentos didáticos do plano',
      });

      return { valido: false, erros, avisos, score: 0 };
    }

    // Verifica se segue ordem progressiva
    let indiceEsperado = 0;
    for (let i = 0; i < momentos.length; i++) {
      const momento = momentos[i]!;
      const posicaoEsperada = ordemEsperada.indexOf(momento);

      if (posicaoEsperada < indiceEsperado) {
        avisos.push({
          tipo: 'progressao',
          mensagem: `Momento "${momento}" aparece fora da ordem pedagógica esperada`,
          recomendacao: `A progressão ideal segue: ${ordemEsperada.join(' → ')}`,
        });
      } else {
        indiceEsperado = posicaoEsperada;
      }
    }

    // Avisa se falta algum momento da progressão completa
    const momentosFaltantes = ordemEsperada.filter((m) => !momentos.includes(m));
    if (momentosFaltantes.length > 0) {
      avisos.push({
        tipo: 'progressao',
        mensagem: `Faltam momentos na progressão: ${momentosFaltantes.join(', ')}`,
        recomendacao:
          'Para uma progressão completa segundo Perrenoud, considere incluir todos os 4 momentos',
      });
    }

    const score = Math.max(0, 100 - avisos.length * 10);

    return {
      valido: erros.length === 0,
      erros,
      avisos,
      score,
    };
  }

  /**
   * Valida complexidade crescente de processos cognitivos
   */
  validarComplexidadeCrescente(processos: ProcessoCognitivo[]): ValidacaoCoerencia {
    const erros: ErroCoerencia[] = [];
    const avisos: AvisoCoerencia[] = [];

    if (processos.length < 2) {
      avisos.push({
        tipo: 'progressao',
        mensagem: 'Apenas um processo cognitivo foi especificado',
        recomendacao: 'Considere criar uma progressão com múltiplos níveis cognitivos',
      });

      return { valido: true, erros, avisos, score: 70 };
    }

    // Verifica se há progressão crescente
    let temProgressao = false;
    for (let i = 0; i < processos.length - 1; i++) {
      if (processos[i + 1]! > processos[i]!) {
        temProgressao = true;
        break;
      }
    }

    if (!temProgressao) {
      avisos.push({
        tipo: 'progressao',
        mensagem: 'Não há progressão crescente de complexidade cognitiva',
        recomendacao:
          'Considere organizar as atividades de forma a progredir de processos mais simples para mais complexos',
      });
    }

    // Calcula o nível médio de complexidade
    const complexidadeMedia = processos.reduce((acc, p) => acc + p, 0) / processos.length;

    if (complexidadeMedia < 2) {
      avisos.push({
        tipo: 'progressao',
        mensagem: 'Complexidade cognitiva média muito baixa',
        recomendacao:
          'Considere incluir processos cognitivos de ordem superior (Analisar, Avaliar, Criar)',
      });
    }

    const score = Math.max(0, 100 - avisos.length * 15);

    return {
      valido: erros.length === 0,
      erros,
      avisos,
      score,
    };
  }
}

/**
 * Validador Integrado de Alinhamento Pedagógico
 */
export class ValidadorAlinhamentoPedagogico {
  private validadorBNCCBloom = new ValidadorBNCCBloom();
  private validadorBloomVirtudes = new ValidadorBloomVirtudes();

  /**
   * Valida alinhamento completo BNCC ↔ Bloom ↔ Virtudes ↔ Perrenoud
   */
  validarAlinhamentoCompleto(alinhamento: AlinhamentoPedagogico): ValidacaoCoerencia {
    const resultados: ValidacaoCoerencia[] = [];

    // Extrai processos cognitivos das células Bloom
    const processos = alinhamento.celulasBloom
      .map((codigo) => catalogoBloom.getCelulaPorCodigo(codigo))
      .filter((celula) => celula !== null)
      .map((celula) => celula!.processoCognitivo);

    // Valida BNCC ↔ Bloom
    resultados.push(
      this.validadorBNCCBloom.validarProcessosCognitivos(
        [...alinhamento.habilidadesBNCC],
        processos
      )
    );

    // Valida Bloom ↔ Virtudes
    resultados.push(
      this.validadorBloomVirtudes.validarAlinhamento(processos, [...alinhamento.virtudes])
    );

    // Agrega resultados
    const todosErros = resultados.flatMap((r) => r.erros);
    const todosAvisos = resultados.flatMap((r) => r.avisos);
    const scoreGeral = resultados.reduce((acc, r) => acc + r.score, 0) / resultados.length;

    return {
      valido: todosErros.length === 0,
      erros: todosErros,
      avisos: todosAvisos,
      score: Math.round(scoreGeral),
    };
  }
}

/**
 * Instâncias exportadas dos validadores
 */
export const validadorBNCCBloom = new ValidadorBNCCBloom();
export const validadorBloomVirtudes = new ValidadorBloomVirtudes();
export const validadorAlinhamento = new ValidadorAlinhamentoPedagogico();

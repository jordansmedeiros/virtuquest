/**
 * Repositório Estático para Catálogo de Virtudes Intelectuais
 *
 * Fornece acesso imutável a:
 * - 6 virtudes intelectuais core
 * - Indicadores observáveis
 * - Mapeamentos para Bloom e BNCC
 *
 * @see docs/development/SPECS.md (linha 1846)
 */

import {
  CategoriaVirtude,
  NivelDesenvolvimento,
  type VirtudeIntelectual,
  type IndicadorVirtude,
} from './types';
import { ProcessoCognitivo } from '../bloom/types';

/**
 * Repositório de Virtudes Intelectuais (Singleton, Imutável)
 */
class CatalogoVirtudesRepository {
  private readonly virtudes: Map<string, VirtudeIntelectual>;
  private readonly indicadores: Map<string, IndicadorVirtude[]>;
  private readonly mapeamentoBloom: Map<ProcessoCognitivo, string[]>;
  private readonly mapeamentoBNCC: Map<number, string[]>;

  constructor() {
    this.virtudes = new Map();
    this.indicadores = new Map();
    this.mapeamentoBloom = new Map();
    this.mapeamentoBNCC = new Map();

    this.inicializarVirtudes();
    this.construirMapeamentos();
  }

  /**
   * Inicializa as 6 virtudes core do sistema
   */
  private inicializarVirtudes(): void {
    const virtudes: VirtudeIntelectual[] = [
      {
        id: 'curiosidade-intelectual',
        nome: 'Curiosidade Intelectual',
        categoria: CategoriaVirtude.EPISTEMICA,
        definicao:
          'Disposição para buscar conhecimento, fazer perguntas investigativas e explorar ideias além do superficial.',
        indicadores: [
          {
            id: 'ci-ind-01',
            virtudeId: 'curiosidade-intelectual',
            descricao: 'Formula perguntas investigativas',
            evidencias: [
              'Faz perguntas além do conteúdo apresentado',
              'Questiona pressupostos e afirmações',
              'Busca compreender causas e relações',
            ],
            situacoesExemplo: [
              'Durante discussões em aula',
              'Ao ler textos acadêmicos',
              'Em trabalhos de pesquisa',
            ],
            nivelEsperado: NivelDesenvolvimento.INTERMEDIARIO,
          },
          {
            id: 'ci-ind-02',
            virtudeId: 'curiosidade-intelectual',
            descricao: 'Busca múltiplas fontes de informação',
            evidencias: [
              'Consulta diferentes materiais sobre o tema',
              'Compara perspectivas diversas',
              'Não se contenta com uma única fonte',
            ],
            situacoesExemplo: [
              'Pesquisas escolares',
              'Estudo independente',
              'Projetos interdisciplinares',
            ],
            nivelEsperado: NivelDesenvolvimento.AVANCADO,
          },
        ],
        processosBloomRelacionados: [ProcessoCognitivo.ANALISAR, ProcessoCognitivo.CRIAR],
        competenciasBNCCRelacionadas: [2],
        nivelDesenvolvimento: {
          inicial: 'Faz perguntas básicas sobre tópicos apresentados',
          intermediario: 'Investiga sistematicamente temas de interesse com perguntas aprofundadas',
          avancado: 'Formula hipóteses originais e busca validá-las com rigor',
        },
      },
      {
        id: 'humildade-intelectual',
        nome: 'Humildade Intelectual',
        categoria: CategoriaVirtude.MORAL,
        definicao:
          'Reconhecimento dos limites do próprio conhecimento e abertura para aprender com outros.',
        indicadores: [
          {
            id: 'hi-ind-01',
            virtudeId: 'humildade-intelectual',
            descricao: 'Reconhece e admite erros',
            evidencias: [
              'Admite quando não sabe algo',
              'Aceita correções sem defensividade',
              'Revisa posições diante de novas evidências',
            ],
            situacoesExemplo: [
              'Feedback de professores',
              'Revisão de trabalhos',
              'Discussões acadêmicas',
            ],
            nivelEsperado: NivelDesenvolvimento.INTERMEDIARIO,
          },
        ],
        processosBloomRelacionados: [ProcessoCognitivo.AVALIAR],
        competenciasBNCCRelacionadas: [6, 8],
        nivelDesenvolvimento: {
          inicial: 'Aceita feedback com relutância',
          intermediario: 'Busca ativamente feedback e reconhece limitações',
          avancado: 'Cultiva consciência metacognitiva sobre próprio conhecimento',
        },
      },
      {
        id: 'coragem-intelectual',
        nome: 'Coragem Intelectual',
        categoria: CategoriaVirtude.PRATICA,
        definicao:
          'Disposição para defender ideias fundamentadas e questionar consensos quando necessário.',
        indicadores: [
          {
            id: 'co-ind-01',
            virtudeId: 'coragem-intelectual',
            descricao: 'Expressa opiniões fundamentadas mesmo quando impopulares',
            evidencias: [
              'Defende posições com argumentos',
              'Questiona autoridades com respeito',
              'Assume riscos intelectuais',
            ],
            situacoesExemplo: [
              'Debates em classe',
              'Apresentações de trabalhos',
              'Discussões críticas',
            ],
            nivelEsperado: NivelDesenvolvimento.AVANCADO,
          },
        ],
        processosBloomRelacionados: [ProcessoCognitivo.AVALIAR, ProcessoCognitivo.CRIAR],
        competenciasBNCCRelacionadas: [10],
        nivelDesenvolvimento: {
          inicial: 'Expressa opiniões ocasionalmente',
          intermediario: 'Defende ideias com argumentos em contextos seguros',
          avancado: 'Assume posições fundamentadas mesmo diante de oposição',
        },
      },
      {
        id: 'autonomia-intelectual',
        nome: 'Autonomia Intelectual',
        categoria: CategoriaVirtude.PRATICA,
        definicao: 'Capacidade de pensar e agir independentemente com responsabilidade.',
        indicadores: [
          {
            id: 'au-ind-01',
            virtudeId: 'autonomia-intelectual',
            descricao: 'Toma decisões próprias sobre aprendizado',
            evidencias: [
              'Gerencia próprio estudo',
              'Busca soluções independentes',
              'Escolhe caminhos de aprendizagem',
            ],
            situacoesExemplo: [
              'Projetos autônomos',
              'Estudo autodirigido',
              'Resolução de problemas',
            ],
            nivelEsperado: NivelDesenvolvimento.AVANCADO,
          },
        ],
        processosBloomRelacionados: [ProcessoCognitivo.APLICAR, ProcessoCognitivo.CRIAR],
        competenciasBNCCRelacionadas: [10],
        nivelDesenvolvimento: {
          inicial: 'Segue orientações com pouca iniciativa própria',
          intermediario: 'Toma decisões sobre aprendizado com suporte',
          avancado: 'Dirige autonomamente próprio desenvolvimento intelectual',
        },
      },
      {
        id: 'perseveranca',
        nome: 'Perseverança',
        categoria: CategoriaVirtude.PRATICA,
        definicao:
          'Persistência diante de desafios cognitivos e disposição para superar dificuldades.',
        indicadores: [
          {
            id: 'pe-ind-01',
            virtudeId: 'perseveranca',
            descricao: 'Persiste em tarefas difíceis',
            evidencias: [
              'Não desiste facilmente',
              'Tenta múltiplas estratégias',
              'Busca ajuda quando necessário',
            ],
            situacoesExemplo: [
              'Problemas complexos',
              'Projetos de longo prazo',
              'Aprendizado de conceitos difíceis',
            ],
            nivelEsperado: NivelDesenvolvimento.INTERMEDIARIO,
          },
        ],
        processosBloomRelacionados: [ProcessoCognitivo.APLICAR, ProcessoCognitivo.CRIAR],
        competenciasBNCCRelacionadas: [8],
        nivelDesenvolvimento: {
          inicial: 'Desiste diante de dificuldades iniciais',
          intermediario: 'Persiste com esforço consciente',
          avancado: 'Demonstra resiliência natural diante de desafios',
        },
      },
      {
        id: 'rigor-intelectual',
        nome: 'Rigor Intelectual',
        categoria: CategoriaVirtude.EPISTEMICA,
        definicao: 'Compromisso com precisão, evidências e raciocínio lógico.',
        indicadores: [
          {
            id: 'ri-ind-01',
            virtudeId: 'rigor-intelectual',
            descricao: 'Verifica fontes e busca evidências',
            evidencias: [
              'Questiona validade de informações',
              'Busca dados confiáveis',
              'Argumenta logicamente',
            ],
            situacoesExemplo: ['Pesquisas acadêmicas', 'Análise de textos', 'Argumentação'],
            nivelEsperado: NivelDesenvolvimento.AVANCADO,
          },
        ],
        processosBloomRelacionados: [ProcessoCognitivo.ANALISAR, ProcessoCognitivo.AVALIAR],
        competenciasBNCCRelacionadas: [7],
        nivelDesenvolvimento: {
          inicial: 'Aceita informações sem questionamento',
          intermediario: 'Verifica fontes e busca evidências ocasionalmente',
          avancado: 'Aplica rigor sistemático em análises e argumentações',
        },
      },
    ];

    virtudes.forEach((v) => {
      this.virtudes.set(v.id, v);
      this.indicadores.set(v.id, v.indicadores);
    });
  }

  /**
   * Constrói mapeamentos bidirecionais
   */
  private construirMapeamentos(): void {
    this.virtudes.forEach((virtude) => {
      // Mapeamento Bloom
      virtude.processosBloomRelacionados.forEach((processo) => {
        const virtudesExistentes = this.mapeamentoBloom.get(processo) || [];
        this.mapeamentoBloom.set(processo, [...virtudesExistentes, virtude.id]);
      });

      // Mapeamento BNCC
      virtude.competenciasBNCCRelacionadas.forEach((comp) => {
        const virtudesExistentes = this.mapeamentoBNCC.get(comp) || [];
        this.mapeamentoBNCC.set(comp, [...virtudesExistentes, virtude.id]);
      });
    });
  }

  // === Métodos de Consulta ===

  getVirtude(nome: string): VirtudeIntelectual | null {
    return this.virtudes.get(nome) || null;
  }

  listarVirtudes(): VirtudeIntelectual[] {
    return Array.from(this.virtudes.values());
  }

  listarVirtudesPorCategoria(categoria: CategoriaVirtude): VirtudeIntelectual[] {
    return Array.from(this.virtudes.values()).filter((v) => v.categoria === categoria);
  }

  getIndicadores(virtudeId: string): IndicadorVirtude[] {
    return this.indicadores.get(virtudeId) || [];
  }

  listarVirtudesPorProcessoBloom(processo: ProcessoCognitivo): VirtudeIntelectual[] {
    const virtudeIds = this.mapeamentoBloom.get(processo) || [];
    return virtudeIds.map((id) => this.virtudes.get(id)!).filter(Boolean);
  }

  listarVirtudesPorCompetenciaBNCC(competencia: number): VirtudeIntelectual[] {
    const virtudeIds = this.mapeamentoBNCC.get(competencia) || [];
    return virtudeIds.map((id) => this.virtudes.get(id)!).filter(Boolean);
  }

  // === Métodos de Análise ===

  /**
   * Calcula densidade de virtudes em um conjunto (0-100)
   */
  calcularDensidadeVirtudes(virtudes: string[]): number {
    const totalVirtudes = this.virtudes.size;
    const virtudesPresentes = virtudes.filter((v) => this.virtudes.has(v)).length;

    return (virtudesPresentes / totalVirtudes) * 100;
  }
}

/**
 * Instância singleton do catálogo de virtudes
 */
export const catalogoVirtudes = new CatalogoVirtudesRepository();

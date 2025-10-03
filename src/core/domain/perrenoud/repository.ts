/**
 * Repositório Estático para Catálogo Perrenoud
 *
 * Fornece acesso imutável a:
 * - Competências (mobilização de recursos)
 * - Situações-Problema exemplares
 * - Esquemas de Mobilização
 * - Recursos Cognitivos
 *
 * @see docs/development/SPECS.md (linhas 1757-1808)
 */

import type {
  Competencia,
  SituacaoProblema,
  EsquemaMobilizacao,
  RecursoCognitivo,
  PassoCognitivo,
  MomentoDidatico,
  Transferibilidade,
  ComplexidadeSituacao,
  AberturaSituacao,
} from './types';
import { ProcessoCognitivo, TipoConhecimento } from '../bloom/types';

/**
 * Repositório de Catálogo Perrenoud (Singleton, Imutável)
 */
class CatalogoPerrenoudRepository {
  private readonly competencias: Map<string, Competencia>;
  private readonly situacoesProblema: Map<string, SituacaoProblema>;
  private readonly esquemasMobilizacao: Map<string, EsquemaMobilizacao>;
  private readonly recursosCognitivos: Map<string, RecursoCognitivo>;

  constructor() {
    this.competencias = new Map();
    this.situacoesProblema = new Map();
    this.esquemasMobilizacao = new Map();
    this.recursosCognitivos = new Map();

    this.inicializarDados();
  }

  /**
   * Inicializa dados seed do catálogo
   */
  private inicializarDados(): void {
    this.carregarRecursosCognitivos();
    this.carregarEsquemasMobilizacao();
    this.carregarSituacoesProblema();
    this.carregarCompetencias();
  }

  /**
   * Carrega recursos cognitivos exemplares
   */
  private carregarRecursosCognitivos(): void {
    const recursos: RecursoCognitivo[] = [
      {
        id: 'rc-conhec-01',
        tipo: 'conhecimento',
        categoria: TipoConhecimento.CONCEITUAL,
        descricao: 'Conceitos fundamentais de matemática',
        mobilizavel: true,
        dominio: 'Matemática',
      },
      {
        id: 'rc-conhec-02',
        tipo: 'conhecimento',
        categoria: TipoConhecimento.PROCEDIMENTAL,
        descricao: 'Método científico de investigação',
        mobilizavel: true,
        dominio: 'Ciências',
      },
      {
        id: 'rc-conhec-03',
        tipo: 'conhecimento',
        categoria: TipoConhecimento.CONCEITUAL,
        descricao: 'Teorias de interpretação textual',
        mobilizavel: true,
        dominio: 'Língua Portuguesa',
      },
      {
        id: 'rc-hab-01',
        tipo: 'habilidade',
        categoria: TipoConhecimento.PROCEDIMENTAL,
        descricao: 'Análise crítica de fontes de informação',
        mobilizavel: true,
        dominio: 'Transversal',
      },
      {
        id: 'rc-hab-02',
        tipo: 'habilidade',
        categoria: TipoConhecimento.PROCEDIMENTAL,
        descricao: 'Comunicação efetiva oral e escrita',
        mobilizavel: true,
        dominio: 'Transversal',
      },
      {
        id: 'rc-hab-03',
        tipo: 'habilidade',
        categoria: TipoConhecimento.PROCEDIMENTAL,
        descricao: 'Resolução colaborativa de problemas',
        mobilizavel: true,
        dominio: 'Transversal',
      },
      {
        id: 'rc-atit-01',
        tipo: 'atitude',
        categoria: TipoConhecimento.METACOGNITIVO,
        descricao: 'Perseverança diante de desafios',
        mobilizavel: true,
        dominio: 'Socioemocional',
      },
      {
        id: 'rc-atit-02',
        tipo: 'atitude',
        categoria: TipoConhecimento.METACOGNITIVO,
        descricao: 'Abertura para perspectivas diversas',
        mobilizavel: true,
        dominio: 'Socioemocional',
      },
      {
        id: 'rc-val-01',
        tipo: 'valor',
        categoria: TipoConhecimento.METACOGNITIVO,
        descricao: 'Compromisso com a verdade e rigor intelectual',
        mobilizavel: true,
        dominio: 'Ético',
      },
      {
        id: 'rc-val-02',
        tipo: 'valor',
        categoria: TipoConhecimento.METACOGNITIVO,
        descricao: 'Responsabilidade social e cidadania',
        mobilizavel: true,
        dominio: 'Ético',
      },
    ];

    recursos.forEach((recurso) => {
      this.recursosCognitivos.set(recurso.id, recurso);
    });
  }

  /**
   * Carrega esquemas de mobilização exemplares
   */
  private carregarEsquemasMobilizacao(): void {
    const esquemas: EsquemaMobilizacao[] = [
      {
        id: 'em-01',
        nome: 'Esquema de Leitura Analítica',
        descricao: 'Estratégia para análise crítica e compreensão profunda de textos',
        passos: [
          {
            ordem: 1,
            acao: 'Realizar leitura inicial para compreensão geral',
            processoCognitivo: ProcessoCognitivo.ENTENDER,
            recursosUtilizados: ['rc-conhec-03'],
            resultado: 'Compreensão da ideia central e estrutura textual',
          },
          {
            ordem: 2,
            acao: 'Identificar argumentos principais e evidências',
            processoCognitivo: ProcessoCognitivo.ANALISAR,
            recursosUtilizados: ['rc-conhec-03', 'rc-hab-01'],
            resultado: 'Mapa mental com argumentação estruturada',
          },
          {
            ordem: 3,
            acao: 'Avaliar validade dos argumentos e qualidade das fontes',
            processoCognitivo: ProcessoCognitivo.AVALIAR,
            recursosUtilizados: ['rc-hab-01', 'rc-val-01'],
            resultado: 'Julgamento crítico fundamentado',
          },
          {
            ordem: 4,
            acao: 'Sintetizar interpretação pessoal fundamentada',
            processoCognitivo: ProcessoCognitivo.CRIAR,
            recursosUtilizados: ['rc-hab-02', 'rc-val-01'],
            resultado: 'Interpretação original e justificada',
          },
        ] as PassoCognitivo[],
        gatilhos: [
          'Encontro com texto complexo ou acadêmico',
          'Necessidade de compreensão profunda de conteúdo',
          'Preparação para debate ou produção textual',
        ],
        contextoAplicacao: [
          'Leitura de textos acadêmicos',
          'Análise literária',
          'Pesquisa científica',
          'Preparação para debates',
        ],
        recursosEnvolvidos: ['rc-conhec-03', 'rc-hab-01', 'rc-hab-02', 'rc-val-01'],
      },
      {
        id: 'em-02',
        nome: 'Esquema de Investigação Científica',
        descricao: 'Padrão de raciocínio para resolução de problemas via método científico',
        passos: [
          {
            ordem: 1,
            acao: 'Observar fenômeno e formular questão de pesquisa',
            processoCognitivo: ProcessoCognitivo.LEMBRAR,
            recursosUtilizados: ['rc-conhec-02'],
            resultado: 'Questão de pesquisa bem delimitada',
          },
          {
            ordem: 2,
            acao: 'Formular hipóteses explicativas baseadas em conhecimento prévio',
            processoCognitivo: ProcessoCognitivo.APLICAR,
            recursosUtilizados: ['rc-conhec-02', 'rc-conhec-01'],
            resultado: 'Hipóteses testáveis',
          },
          {
            ordem: 3,
            acao: 'Planejar e executar experimento controlado',
            processoCognitivo: ProcessoCognitivo.APLICAR,
            recursosUtilizados: ['rc-conhec-02', 'rc-hab-03'],
            resultado: 'Dados empíricos coletados',
          },
          {
            ordem: 4,
            acao: 'Analisar dados e identificar padrões',
            processoCognitivo: ProcessoCognitivo.ANALISAR,
            recursosUtilizados: ['rc-conhec-01', 'rc-hab-01'],
            resultado: 'Padrões e relações identificados',
          },
          {
            ordem: 5,
            acao: 'Avaliar hipóteses à luz das evidências',
            processoCognitivo: ProcessoCognitivo.AVALIAR,
            recursosUtilizados: ['rc-val-01'],
            resultado: 'Conclusões fundamentadas em evidências',
          },
        ] as PassoCognitivo[],
        gatilhos: [
          'Problema ou fenômeno que requer explicação',
          'Necessidade de testar afirmações cientificamente',
        ],
        contextoAplicacao: [
          'Aulas de ciências experimentais',
          'Feiras de ciências',
          'Projetos de pesquisa',
        ],
        recursosEnvolvidos: ['rc-conhec-01', 'rc-conhec-02', 'rc-hab-01', 'rc-hab-03', 'rc-val-01'],
      },
      {
        id: 'em-03',
        nome: 'Esquema de Resolução Colaborativa de Problemas',
        descricao: 'Estratégia para trabalho em equipe na resolução de problemas complexos',
        passos: [
          {
            ordem: 1,
            acao: 'Compreender coletivamente o problema',
            processoCognitivo: ProcessoCognitivo.ENTENDER,
            recursosUtilizados: ['rc-hab-02'],
            resultado: 'Consenso sobre natureza do problema',
          },
          {
            ordem: 2,
            acao: 'Distribuir responsabilidades conforme competências',
            processoCognitivo: ProcessoCognitivo.APLICAR,
            recursosUtilizados: ['rc-hab-03', 'rc-atit-02'],
            resultado: 'Plano de trabalho colaborativo',
          },
          {
            ordem: 3,
            acao: 'Integrar contribuições individuais',
            processoCognitivo: ProcessoCognitivo.ANALISAR,
            recursosUtilizados: ['rc-hab-03', 'rc-atit-02'],
            resultado: 'Solução integrada',
          },
          {
            ordem: 4,
            acao: 'Avaliar solução coletivamente e refinar',
            processoCognitivo: ProcessoCognitivo.AVALIAR,
            recursosUtilizados: ['rc-hab-01', 'rc-val-01'],
            resultado: 'Solução otimizada e consensual',
          },
        ] as PassoCognitivo[],
        gatilhos: [
          'Problema que excede capacidade individual',
          'Necessidade de múltiplas perspectivas',
        ],
        contextoAplicacao: [
          'Trabalhos em grupo',
          'Projetos interdisciplinares',
          'Desafios de design thinking',
        ],
        recursosEnvolvidos: ['rc-hab-01', 'rc-hab-02', 'rc-hab-03', 'rc-atit-02', 'rc-val-01'],
      },
    ];

    esquemas.forEach((esquema) => {
      this.esquemasMobilizacao.set(esquema.id, esquema);
    });
  }

  /**
   * Carrega situações-problema exemplares
   */
  private carregarSituacoesProblema(): void {
    const situacoes: SituacaoProblema[] = [
      {
        id: 'sp-01',
        competenciaId: 'comp-leitura-critica',
        contexto:
          'Escola debate fake news sobre tema científico circulando nas redes sociais da comunidade',
        enunciado:
          'Analisar notícias sobre o tema, identificar fontes confiáveis, e produzir material educativo para a comunidade escolar',
        complexidade: 'complexa' as ComplexidadeSituacao,
        autenticidade: true,
        abertura: 'aberta' as AberturaSituacao,
        multiplasSolucoes: true,
        recursosNecessarios: ['rc-conhec-03', 'rc-hab-01', 'rc-hab-02', 'rc-val-01'],
        processosRequeridos: [
          ProcessoCognitivo.ANALISAR,
          ProcessoCognitivo.AVALIAR,
          ProcessoCognitivo.CRIAR,
        ],
        momento: 'criacao' as MomentoDidatico,
      },
      {
        id: 'sp-02',
        competenciaId: 'comp-leitura-critica',
        contexto: 'Atividade de análise de artigo de opinião em sala de aula',
        enunciado:
          'Identificar a tese, os argumentos e as evidências apresentadas no texto, comparando com outras perspectivas',
        complexidade: 'intermediaria' as ComplexidadeSituacao,
        autenticidade: true,
        abertura: 'semi-aberta' as AberturaSituacao,
        multiplasSolucoes: true,
        recursosNecessarios: ['rc-conhec-03', 'rc-hab-01'],
        processosRequeridos: [ProcessoCognitivo.ANALISAR, ProcessoCognitivo.AVALIAR],
        momento: 'aplicacao_guiada' as MomentoDidatico,
      },
      {
        id: 'sp-03',
        competenciaId: 'comp-investigacao-cientifica',
        contexto:
          'Problema ambiental na comunidade escolar (ex: desperdício de água, acúmulo de lixo)',
        enunciado:
          'Investigar as causas do problema, propor soluções baseadas em evidências científicas e implementar ação educativa',
        complexidade: 'complexa' as ComplexidadeSituacao,
        autenticidade: true,
        abertura: 'aberta' as AberturaSituacao,
        multiplasSolucoes: true,
        recursosNecessarios: ['rc-conhec-02', 'rc-hab-01', 'rc-hab-03', 'rc-val-02', 'rc-atit-01'],
        processosRequeridos: [
          ProcessoCognitivo.ANALISAR,
          ProcessoCognitivo.AVALIAR,
          ProcessoCognitivo.CRIAR,
        ],
        momento: 'criacao' as MomentoDidatico,
      },
      {
        id: 'sp-04',
        competenciaId: 'comp-investigacao-cientifica',
        contexto: 'Experimento científico sobre fenômeno natural estudado em aula',
        enunciado:
          'Formular hipótese, planejar experimento, coletar dados e analisar resultados em equipe',
        complexidade: 'intermediaria' as ComplexidadeSituacao,
        autenticidade: true,
        abertura: 'semi-aberta' as AberturaSituacao,
        multiplasSolucoes: false,
        recursosNecessarios: ['rc-conhec-02', 'rc-conhec-01', 'rc-hab-03'],
        processosRequeridos: [ProcessoCognitivo.APLICAR, ProcessoCognitivo.ANALISAR],
        momento: 'aplicacao_guiada' as MomentoDidatico,
      },
      {
        id: 'sp-05',
        competenciaId: 'comp-colaboracao',
        contexto: 'Projeto interdisciplinar envolvendo múltiplas disciplinas e professores',
        enunciado:
          'Trabalhar em equipe para desenvolver solução criativa integrando conhecimentos de diferentes áreas',
        complexidade: 'complexa' as ComplexidadeSituacao,
        autenticidade: true,
        abertura: 'aberta' as AberturaSituacao,
        multiplasSolucoes: true,
        recursosNecessarios: ['rc-hab-02', 'rc-hab-03', 'rc-atit-02', 'rc-val-02'],
        processosRequeridos: [ProcessoCognitivo.APLICAR, ProcessoCognitivo.CRIAR],
        momento: 'criacao' as MomentoDidatico,
      },
    ];

    situacoes.forEach((situacao) => {
      this.situacoesProblema.set(situacao.id, situacao);
    });
  }

  /**
   * Carrega competências exemplares segundo Perrenoud
   */
  private carregarCompetencias(): void {
    const competencias: Competencia[] = [
      {
        id: 'comp-leitura-critica',
        nome: 'Competência de Leitura Crítica',
        descricao:
          'Capacidade de mobilizar recursos cognitivos para compreender, analisar criticamente e avaliar textos de diferentes gêneros e complexidades',
        recursos: [
          this.recursosCognitivos.get('rc-conhec-03')!,
          this.recursosCognitivos.get('rc-hab-01')!,
          this.recursosCognitivos.get('rc-hab-02')!,
          this.recursosCognitivos.get('rc-val-01')!,
        ],
        situacoesFamilia: [
          this.situacoesProblema.get('sp-01')!,
          this.situacoesProblema.get('sp-02')!,
        ],
        esquemasMobilizacao: [this.esquemasMobilizacao.get('em-01')!],
        contextoEspecifico: false,
        transferibilidade: 'alta' as Transferibilidade,
        complexidadeCognitiva: 4,
      },
      {
        id: 'comp-investigacao-cientifica',
        nome: 'Competência de Investigação Científica',
        descricao:
          'Capacidade de mobilizar método científico e raciocínio lógico-matemático para investigar fenômenos, formular hipóteses e validá-las empiricamente',
        recursos: [
          this.recursosCognitivos.get('rc-conhec-01')!,
          this.recursosCognitivos.get('rc-conhec-02')!,
          this.recursosCognitivos.get('rc-hab-01')!,
          this.recursosCognitivos.get('rc-hab-03')!,
          this.recursosCognitivos.get('rc-val-01')!,
          this.recursosCognitivos.get('rc-atit-01')!,
        ],
        situacoesFamilia: [
          this.situacoesProblema.get('sp-03')!,
          this.situacoesProblema.get('sp-04')!,
        ],
        esquemasMobilizacao: [this.esquemasMobilizacao.get('em-02')!],
        contextoEspecifico: true,
        transferibilidade: 'media' as Transferibilidade,
        complexidadeCognitiva: 5,
      },
      {
        id: 'comp-colaboracao',
        nome: 'Competência de Colaboração Efetiva',
        descricao:
          'Capacidade de mobilizar habilidades sociais e cognitivas para trabalhar produtivamente em equipe na resolução de problemas complexos',
        recursos: [
          this.recursosCognitivos.get('rc-hab-01')!,
          this.recursosCognitivos.get('rc-hab-02')!,
          this.recursosCognitivos.get('rc-hab-03')!,
          this.recursosCognitivos.get('rc-atit-02')!,
          this.recursosCognitivos.get('rc-val-02')!,
        ],
        situacoesFamilia: [this.situacoesProblema.get('sp-05')!],
        esquemasMobilizacao: [this.esquemasMobilizacao.get('em-03')!],
        contextoEspecifico: false,
        transferibilidade: 'alta' as Transferibilidade,
        complexidadeCognitiva: 3,
      },
    ];

    competencias.forEach((comp) => {
      this.competencias.set(comp.id, comp);
    });
  }

  // === Métodos de Consulta - Competências ===

  getCompetencia(id: string): Competencia | null {
    return this.competencias.get(id) || null;
  }

  listarCompetencias(): Competencia[] {
    return Array.from(this.competencias.values());
  }

  buscarCompetenciasPorTransferibilidade(transferibilidade: Transferibilidade): Competencia[] {
    return Array.from(this.competencias.values()).filter(
      (c) => c.transferibilidade === transferibilidade
    );
  }

  buscarCompetenciasPorComplexidade(
    complexidadeMin: number,
    complexidadeMax: number
  ): Competencia[] {
    return Array.from(this.competencias.values()).filter(
      (c) =>
        c.complexidadeCognitiva >= complexidadeMin && c.complexidadeCognitiva <= complexidadeMax
    );
  }

  // === Métodos de Consulta - Situações-Problema ===

  getSituacaoProblema(id: string): SituacaoProblema | null {
    return this.situacoesProblema.get(id) || null;
  }

  listarSituacoesProblema(): SituacaoProblema[] {
    return Array.from(this.situacoesProblema.values());
  }

  buscarSituacoesPorCompetencia(competenciaId: string): SituacaoProblema[] {
    return Array.from(this.situacoesProblema.values()).filter(
      (s) => s.competenciaId === competenciaId
    );
  }

  buscarSituacoesPorMomento(momento: MomentoDidatico): SituacaoProblema[] {
    return Array.from(this.situacoesProblema.values()).filter((s) => s.momento === momento);
  }

  buscarSituacoesPorComplexidade(complexidade: ComplexidadeSituacao): SituacaoProblema[] {
    return Array.from(this.situacoesProblema.values()).filter(
      (s) => s.complexidade === complexidade
    );
  }

  // === Métodos de Consulta - Esquemas de Mobilização ===

  getEsquemaMobilizacao(id: string): EsquemaMobilizacao | null {
    return this.esquemasMobilizacao.get(id) || null;
  }

  listarEsquemasMobilizacao(): EsquemaMobilizacao[] {
    return Array.from(this.esquemasMobilizacao.values());
  }

  buscarEsquemasPorRecurso(recursoId: string): EsquemaMobilizacao[] {
    return Array.from(this.esquemasMobilizacao.values()).filter((e) =>
      e.recursosEnvolvidos.includes(recursoId)
    );
  }

  // === Métodos de Consulta - Recursos Cognitivos ===

  getRecursoCognitivo(id: string): RecursoCognitivo | null {
    return this.recursosCognitivos.get(id) || null;
  }

  listarRecursosCognitivos(): RecursoCognitivo[] {
    return Array.from(this.recursosCognitivos.values());
  }

  buscarRecursosPorTipo(
    tipo: 'conhecimento' | 'habilidade' | 'atitude' | 'valor'
  ): RecursoCognitivo[] {
    return Array.from(this.recursosCognitivos.values()).filter((r) => r.tipo === tipo);
  }

  buscarRecursosPorDominio(dominio: string): RecursoCognitivo[] {
    return Array.from(this.recursosCognitivos.values()).filter((r) => r.dominio === dominio);
  }

  // === Métodos de Análise ===

  /**
   * Identifica recursos necessários para uma competência
   */
  getRecursosNecessarios(competenciaId: string): RecursoCognitivo[] {
    const competencia = this.competencias.get(competenciaId);
    return competencia ? [...competencia.recursos] : [];
  }

  /**
   * Identifica esquemas aplicáveis em um contexto
   */
  getEsquemasAplicaveis(contexto: string): EsquemaMobilizacao[] {
    return Array.from(this.esquemasMobilizacao.values()).filter((e) =>
      e.contextoAplicacao.some((c) => c.toLowerCase().includes(contexto.toLowerCase()))
    );
  }
}

/**
 * Singleton exportado do repositório
 */
export const catalogoPerrenoud = new CatalogoPerrenoudRepository();

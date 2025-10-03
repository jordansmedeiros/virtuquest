/**
 * Repositório Estático para Catálogo BNCC
 *
 * Fornece acesso imutável a:
 * - 10 Competências Gerais da BNCC
 * - Competências Específicas por área
 * - Habilidades exemplares (seed data)
 * - Objetos de Conhecimento
 *
 * @see docs/fundamentos/COMPETENCIA_BNCC.md
 * @see docs/fundamentos/TAXONOMIA_BLOOM_BNCC.md
 */

import {
  Etapa,
  ComponenteCurricular,
  type CompetenciaGeral,
  type Habilidade,
  type ObjetoConhecimento,
} from './types';
import { decomposeCodigoHabilidade, validarCodigoBNCC } from './decomposer';

/**
 * Repositório de Catálogo BNCC (Singleton, Imutável)
 */
class CatalogoBNCCRepository {
  private readonly competenciasGerais: Map<number, CompetenciaGeral>;
  private readonly habilidades: Map<string, Habilidade>;
  private readonly objetosConhecimento: Map<string, ObjetoConhecimento>;

  constructor() {
    this.competenciasGerais = new Map();
    this.habilidades = new Map();
    this.objetosConhecimento = new Map();

    this.inicializarDados();
  }

  /**
   * Inicializa dados seed do catálogo
   */
  private inicializarDados(): void {
    this.carregarCompetenciasGerais();
    this.carregarObjetosConhecimento();
    this.carregarHabilidadesExemplares();
  }

  /**
   * Carrega as 10 Competências Gerais da BNCC
   * @see docs/fundamentos/COMPETENCIA_BNCC.md (linhas 151-161)
   */
  private carregarCompetenciasGerais(): void {
    const competencias: CompetenciaGeral[] = [
      {
        id: 'cg-01',
        codigo: 1,
        descricao:
          'Valorizar e utilizar os conhecimentos historicamente construídos sobre o mundo físico, social, cultural e digital para entender e explicar a realidade, continuar aprendendo e colaborar para a construção de uma sociedade justa, democrática e inclusiva.',
        dimensoes: {
          conhecimentos: [
            'Conhecimentos historicamente construídos',
            'Mundo físico e social',
            'Cultura digital',
          ],
          habilidades: ['Compreender realidade', 'Explicar fenômenos', 'Aprender continuamente'],
          atitudes: ['Valorização do conhecimento', 'Colaboração'],
          valores: ['Justiça', 'Democracia', 'Inclusão'],
        },
      },
      {
        id: 'cg-02',
        codigo: 2,
        descricao:
          'Exercitar a curiosidade intelectual e recorrer à abordagem própria das ciências, incluindo a investigação, a reflexão, a análise crítica, a imaginação e a criatividade, para investigar causas, elaborar e testar hipóteses, formular e resolver problemas e criar soluções (inclusive tecnológicas) com base nos conhecimentos das diferentes áreas.',
        dimensoes: {
          conhecimentos: ['Método científico', 'Investigação', 'Conhecimentos interdisciplinares'],
          habilidades: [
            'Investigar',
            'Analisar criticamente',
            'Formular hipóteses',
            'Resolver problemas',
            'Criar soluções',
          ],
          atitudes: ['Curiosidade', 'Criatividade', 'Reflexão'],
          valores: ['Rigor científico', 'Inovação'],
        },
      },
      {
        id: 'cg-03',
        codigo: 3,
        descricao:
          'Valorizar e fruir as diversas manifestações artísticas e culturais, das locais às mundiais, e também participar de práticas diversificadas da produção artístico-cultural.',
        dimensoes: {
          conhecimentos: ['Manifestações artísticas', 'Patrimônio cultural', 'Produção artística'],
          habilidades: ['Fruir arte', 'Apreciar cultura', 'Participar de práticas culturais'],
          atitudes: ['Valorização cultural', 'Abertura estética'],
          valores: ['Diversidade', 'Identidade cultural'],
        },
      },
      {
        id: 'cg-04',
        codigo: 4,
        descricao:
          'Utilizar diferentes linguagens – verbal (oral ou visual-motora, como Libras, e escrita), corporal, visual, sonora e digital –, bem como conhecimentos das linguagens artística, matemática e científica, para se expressar e partilhar informações, experiências, ideias e sentimentos em diferentes contextos e produzir sentidos que levem ao entendimento mútuo.',
        dimensoes: {
          conhecimentos: ['Múltiplas linguagens', 'Linguagem matemática', 'Linguagem científica'],
          habilidades: ['Expressar-se', 'Comunicar', 'Produzir sentidos', 'Compreender outros'],
          atitudes: ['Expressividade', 'Escuta ativa'],
          valores: ['Comunicação', 'Entendimento mútuo'],
        },
      },
      {
        id: 'cg-05',
        codigo: 5,
        descricao:
          'Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais (incluindo as escolares) para se comunicar, acessar e disseminar informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva.',
        dimensoes: {
          conhecimentos: ['Tecnologias digitais', 'Cultura digital', 'Informação e comunicação'],
          habilidades: [
            'Usar tecnologias',
            'Produzir conhecimento digital',
            'Resolver problemas',
            'Exercer autoria',
          ],
          atitudes: ['Criticidade', 'Reflexão', 'Ética digital'],
          valores: ['Responsabilidade digital', 'Protagonismo'],
        },
      },
      {
        id: 'cg-06',
        codigo: 6,
        descricao:
          'Valorizar a diversidade de saberes e vivências culturais e apropriar-se de conhecimentos e experiências que lhe possibilitem entender as relações próprias do mundo do trabalho e fazer escolhas alinhadas ao exercício da cidadania e ao seu projeto de vida, com liberdade, autonomia, consciência crítica e responsabilidade.',
        dimensoes: {
          conhecimentos: ['Diversidade cultural', 'Mundo do trabalho', 'Projeto de vida'],
          habilidades: ['Valorizar diversidade', 'Fazer escolhas', 'Exercer cidadania'],
          atitudes: ['Respeito', 'Autonomia', 'Consciência crítica'],
          valores: ['Liberdade', 'Responsabilidade', 'Cidadania'],
        },
      },
      {
        id: 'cg-07',
        codigo: 7,
        descricao:
          'Argumentar com base em fatos, dados e informações confiáveis, para formular, negociar e defender ideias, pontos de vista e decisões comuns que respeitem e promovam os direitos humanos, a consciência socioambiental e o consumo responsável em âmbito local, regional e global, com posicionamento ético em relação ao cuidado de si mesmo, dos outros e do planeta.',
        dimensoes: {
          conhecimentos: [
            'Argumentação',
            'Dados e evidências',
            'Direitos humanos',
            'Sustentabilidade',
          ],
          habilidades: ['Argumentar', 'Formular ideias', 'Negociar', 'Defender posições'],
          atitudes: ['Rigor intelectual', 'Ética', 'Consciência socioambiental'],
          valores: ['Verdade', 'Justiça', 'Responsabilidade planetária'],
        },
      },
      {
        id: 'cg-08',
        codigo: 8,
        descricao:
          'Conhecer-se, apreciar-se e cuidar de sua saúde física e emocional, compreendendo-se na diversidade humana e reconhecendo suas emoções e as dos outros, com autocrítica e capacidade para lidar com elas.',
        dimensoes: {
          conhecimentos: ['Autoconhecimento', 'Saúde física e emocional', 'Emoções'],
          habilidades: ['Conhecer-se', 'Cuidar de si', 'Reconhecer emoções', 'Exercer autocrítica'],
          atitudes: ['Autoaceitação', 'Autocuidado', 'Empatia'],
          valores: ['Bem-estar', 'Respeito à diversidade'],
        },
      },
      {
        id: 'cg-09',
        codigo: 9,
        descricao:
          'Exercitar a empatia, o diálogo, a resolução de conflitos e a cooperação, fazendo-se respeitar e promovendo o respeito ao outro e aos direitos humanos, com acolhimento e valorização da diversidade de indivíduos e de grupos sociais, seus saberes, identidades, culturas e potencialidades, sem preconceitos de qualquer natureza.',
        dimensoes: {
          conhecimentos: ['Resolução de conflitos', 'Direitos humanos', 'Diversidade social'],
          habilidades: ['Dialogar', 'Cooperar', 'Resolver conflitos', 'Empatizar'],
          atitudes: ['Empatia', 'Acolhimento', 'Respeito'],
          valores: ['Paz', 'Equidade', 'Não-violência'],
        },
      },
      {
        id: 'cg-10',
        codigo: 10,
        descricao:
          'Agir pessoal e coletivamente com autonomia, responsabilidade, flexibilidade, resiliência e determinação, tomando decisões com base em princípios éticos, democráticos, inclusivos, sustentáveis e solidários.',
        dimensoes: {
          conhecimentos: ['Princípios éticos', 'Democracia', 'Sustentabilidade'],
          habilidades: ['Tomar decisões', 'Agir autonomamente', 'Ser resiliente', 'Colaborar'],
          atitudes: ['Autonomia', 'Responsabilidade', 'Determinação', 'Flexibilidade'],
          valores: ['Ética', 'Solidariedade', 'Democracia', 'Sustentabilidade'],
        },
      },
    ];

    competencias.forEach((comp) => this.competenciasGerais.set(comp.codigo, comp));
  }

  /**
   * Carrega objetos de conhecimento exemplares
   */
  private carregarObjetosConhecimento(): void {
    const objetos: ObjetoConhecimento[] = [
      {
        id: 'obj-001',
        nome: 'Estratégias de leitura',
        descricao: 'Localização de informações em textos',
        unidadeTematica: 'Leitura/escuta',
      },
      {
        id: 'obj-002',
        nome: 'Efeitos de sentido',
        descricao: 'Recursos linguísticos e seus efeitos',
        unidadeTematica: 'Análise linguística/semiótica',
      },
      {
        id: 'obj-003',
        nome: 'Números e álgebra',
        descricao: 'Sistema de numeração decimal',
        unidadeTematica: 'Números',
      },
      {
        id: 'obj-004',
        nome: 'Vida e evolução',
        descricao: 'Diversidade dos seres vivos',
        unidadeTematica: 'Vida e evolução',
      },
    ];

    objetos.forEach((obj) => this.objetosConhecimento.set(obj.id, obj));
  }

  /**
   * Carrega habilidades exemplares para MVP
   * @see docs/fundamentos/TAXONOMIA_BLOOM_BNCC.md
   */
  private carregarHabilidadesExemplares(): void {
    const habilidades: Habilidade[] = [
      {
        id: 'hab-001',
        codigo: 'EF67LP08',
        competenciaEspecificaId: 'ce-linguagens-01',
        descricao:
          'Identificar os efeitos de sentido devidos à escolha de imagens estáticas, sequenciação ou sobreposição de imagens, definição de figura/fundo, ângulo, profundidade e foco, cores/tonalidades, relação com o escrito (relações de reiteração, complementação ou oposição) etc. em notícias, reportagens, fotorreportagens, foto-denúncias, memes, gifs, anúncios publicitários e propagandas publicados em jornais, revistas, sites na internet etc.',
        objetosConhecimento: [this.objetosConhecimento.get('obj-002')!],
        etapa: Etapa.EF,
        ano: '67',
        componente: 'LP',
        sequencia: 8,
      },
      {
        id: 'hab-002',
        codigo: 'EF69AR01',
        competenciaEspecificaId: 'ce-linguagens-arte-01',
        descricao:
          'Pesquisar, apreciar e analisar formas distintas das artes visuais tradicionais e contemporâneas, em obras de artistas brasileiros e estrangeiros de diferentes épocas e em diferentes matrizes estéticas e culturais, de modo a ampliar a experiência com diferentes contextos e práticas artístico-visuais e cultivar a percepção, o imaginário, a capacidade de simbolizar e o repertório imagético.',
        objetosConhecimento: [],
        etapa: Etapa.EF,
        ano: '69',
        componente: 'AR',
        sequencia: 1,
      },
      {
        id: 'hab-003',
        codigo: 'EF67EF01',
        competenciaEspecificaId: 'ce-linguagens-ef-01',
        descricao:
          'Experimentar e fruir, na escola e fora dela, jogos eletrônicos diversos, valorizando e respeitando os sentidos e significados atribuídos a eles por diferentes grupos sociais e etários.',
        objetosConhecimento: [],
        etapa: Etapa.EF,
        ano: '67',
        componente: 'EF',
        sequencia: 1,
      },
      {
        id: 'hab-004',
        codigo: 'EF06MA01',
        competenciaEspecificaId: 'ce-matematica-01',
        descricao:
          'Comparar, ordenar, ler e escrever números naturais e números racionais cuja representação decimal é finita, fazendo uso da reta numérica.',
        objetosConhecimento: [this.objetosConhecimento.get('obj-003')!],
        etapa: Etapa.EF,
        ano: '06',
        componente: 'MA',
        sequencia: 1,
      },
      {
        id: 'hab-005',
        codigo: 'EF06CI01',
        competenciaEspecificaId: 'ce-ciencias-01',
        descricao:
          'Classificar como homogênea ou heterogênea a mistura de dois ou mais materiais (água e sal, água e óleo, água e areia etc.).',
        objetosConhecimento: [this.objetosConhecimento.get('obj-004')!],
        etapa: Etapa.EF,
        ano: '06',
        componente: 'CI',
        sequencia: 1,
      },
    ];

    habilidades.forEach((hab) => this.habilidades.set(hab.codigo, hab));
  }

  // === Métodos de Consulta ===

  getCompetenciaGeral(codigo: number): CompetenciaGeral | null {
    return this.competenciasGerais.get(codigo) || null;
  }

  listarCompetenciasGerais(): CompetenciaGeral[] {
    return Array.from(this.competenciasGerais.values());
  }

  getHabilidade(codigo: string): Habilidade | null {
    return this.habilidades.get(codigo) || null;
  }

  listarHabilidadesPorComponente(componente: ComponenteCurricular): Habilidade[] {
    return Array.from(this.habilidades.values()).filter((hab) => {
      const componenteSigla = this.mapComponenteToSigla(componente);
      return hab.componente === componenteSigla;
    });
  }

  listarHabilidadesPorAno(etapa: Etapa, ano: number): Habilidade[] {
    return Array.from(this.habilidades.values()).filter((hab) => {
      const decomp = decomposeCodigoHabilidade(hab.codigo);
      return decomp.etapa === etapa && decomp.anos.includes(ano);
    });
  }

  buscarHabilidades(query: {
    etapa?: Etapa;
    anos?: number[];
    componente?: string;
    texto?: string;
  }): Habilidade[] {
    return Array.from(this.habilidades.values()).filter((hab) => {
      if (query.etapa && hab.etapa !== query.etapa) return false;
      if (query.componente && hab.componente !== query.componente) return false;
      if (query.anos && query.anos.length > 0) {
        const decomp = decomposeCodigoHabilidade(hab.codigo);
        if (!query.anos.some((ano) => decomp.anos.includes(ano))) return false;
      }
      if (query.texto) {
        const textoLower = query.texto.toLowerCase();
        if (!hab.descricao.toLowerCase().includes(textoLower)) return false;
      }
      return true;
    });
  }

  validarCodigoHabilidade(codigo: string): boolean {
    return validarCodigoBNCC(codigo);
  }

  existeHabilidade(codigo: string): boolean {
    return this.habilidades.has(codigo);
  }

  getHierarquia(habilidadeId: string): {
    competenciaGeral: CompetenciaGeral | null;
    habilidade: Habilidade | null;
  } {
    const habilidade =
      Array.from(this.habilidades.values()).find((h) => h.id === habilidadeId) || null;

    // Para MVP, retornamos competência geral 1 como padrão
    const competenciaGeral = this.competenciasGerais.get(1) || null;

    return { competenciaGeral, habilidade };
  }

  getEstatisticas(): {
    totalCompetenciasGerais: number;
    totalHabilidades: number;
    distribuicaoPorArea: Record<string, number>;
  } {
    const distribuicao: Record<string, number> = {};
    this.habilidades.forEach((hab) => {
      distribuicao[hab.componente] = (distribuicao[hab.componente] || 0) + 1;
    });

    return {
      totalCompetenciasGerais: this.competenciasGerais.size,
      totalHabilidades: this.habilidades.size,
      distribuicaoPorArea: distribuicao,
    };
  }

  private mapComponenteToSigla(componente: ComponenteCurricular): string {
    const map: Record<ComponenteCurricular, string> = {
      [ComponenteCurricular.LINGUA_PORTUGUESA]: 'LP',
      [ComponenteCurricular.ARTE]: 'AR',
      [ComponenteCurricular.EDUCACAO_FISICA]: 'EF',
      [ComponenteCurricular.LINGUA_INGLESA]: 'LI',
      [ComponenteCurricular.MATEMATICA]: 'MA',
      [ComponenteCurricular.CIENCIAS]: 'CI',
      [ComponenteCurricular.GEOGRAFIA]: 'GE',
      [ComponenteCurricular.HISTORIA]: 'HI',
      [ComponenteCurricular.ENSINO_RELIGIOSO]: 'ER',
    };
    return map[componente];
  }
}

/**
 * Instância singleton do catálogo BNCC
 */
export const catalogoBNCC = new CatalogoBNCCRepository();

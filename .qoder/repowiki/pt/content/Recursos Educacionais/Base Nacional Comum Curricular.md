# Base Nacional Comum Curricular

<cite>
**Arquivos Referenciados neste Documento**  
- [README.md](file://README.md) - *Atualizado no commit recente*
- [src/core/domain/bncc/repository.ts](file://src\core\domain\bncc\repository.ts) - *Implementação do repositório BNCC com dados seed*
- [src/core/domain/bncc/types.ts](file://src\core\domain\bncc\types.ts) - *Definições de tipos para competências e habilidades*
- [src/core/domain/bncc/decomposer.ts](file://src\core\domain\bncc\decomposer.ts) - *Utilitário de decomposição de códigos BNCC*
- [src/core/domain/README.md](file://src\core\domain\README.md) - *Documentação do agregado BNCC*
</cite>

## Resumo das Atualizações

**Alterações Realizadas**

- Atualizado a seção de Estrutura da BNCC no VirtuQuest com base na
  implementação do domínio BNCC
- Adicionada nova seção sobre Decomposição de Códigos BNCC
- Atualizada a seção de Seleção de Habilidades com base nos métodos de consulta
  do repositório
- Atualizados os exemplos práticos com base nos dados seed do repositório
- Atualizadas as fontes da documentação para refletir os arquivos do domínio
  BNCC

## Sumário

1. [Introdução](#introdução)
2. [Estrutura da BNCC no VirtuQuest](#estrutura-da-bncc-no-virtuquest)
3. [Decomposição de Códigos BNCC](#decomposição-de-códigos-bncc)
4. [Seleção de Habilidades por Componente Curricular e Série](#seleção-de-habilidades-por-componente-curricular-e-série)
5. [Integração com Bloom e Virtudes](#integração-com-bloom-e-virtudes)
6. [Exemplo Prático de Vinculação de Habilidades](#exemplo-prático-de-vinculação-de-habilidades)
7. [Navegação no Seletor de Habilidades BNCC](#navegação-no-seletor-de-habilidades-bncc)

## Introdução

O VirtuQuest é uma plataforma de planejamento pedagógico integrado que alinha as
diretrizes da Base Nacional Comum Curricular (BNCC) com a Taxonomia de Bloom e o
desenvolvimento de Virtudes Intelectuais. Este documento detalha como a BNCC é
implementada na aplicação, com foco na estruturação de competências e
habilidades, sua seleção contextualizada por componente curricular e série, e
sua integração com os demais pilares do sistema. A análise baseia-se nos
fundamentos pedagógicos fornecidos na documentação do projeto e na estrutura de
dados implícita no código.

**Fontes da seção**

- [README.md](file://README.md#L0-L44)
- [src/core/domain/README.md](file://src\core\domain\README.md#L43-L118)

## Estrutura da BNCC no VirtuQuest

A BNCC é estruturada no VirtuQuest como um sistema hierárquico de aprendizagens
essenciais, conforme definido oficialmente. A plataforma implementa as **10
Competências Gerais da Educação Básica**, que servem como macro-orientações para
o desenvolvimento integral dos estudantes. Essas competências são desdobradas em
competências específicas por área de conhecimento (como Língua Portuguesa,
Matemática, Ciências) e, posteriormente, em habilidades associadas a objetos de
conhecimento.

Cada habilidade é identificada por uma codificação alfanumérica única (ex:
EF02CI01), que permite sua localização precisa dentro do currículo. A definição
central da BNCC adotada pela plataforma é que uma **competência** é "a
mobilização de conhecimentos, habilidades, atitudes e valores para resolver
demandas complexas da vida cotidiana, do pleno exercício da cidadania e do mundo
do trabalho". As **habilidades** são os componentes mensuráveis dessa
competência, classificadas em práticas, cognitivas e socioemocionais.

A implementação é baseada no agregado BNCC do domínio, que fornece acesso
imutável ao catálogo completo. O repositório `CatalogoBNCCRepository` é um
singleton que contém todas as competências gerais, habilidades exemplares e
objetos de conhecimento. A estrutura hierárquica é mantida através de mapas
internos que permitem consultas eficientes.

**Fontes da seção**

- [src/core/domain/README.md](file://src\core\domain\README.md#L43-L118)
- [src/core/domain/bncc/repository.ts](file://src\core\domain\bncc\repository.ts#L25-L404)
- [src/core/domain/bncc/types.ts](file://src\core\domain\bncc\types.ts#L0-L223)

## Decomposição de Códigos BNCC

O VirtuQuest inclui um utilitário avançado de decomposição de códigos BNCC que
permite analisar a estrutura dos códigos de habilidades. O código BNCC segue o
padrão: **ETAPA + ANOS + COMPONENTE + SEQUENCIA** (ex: EF67LP08).

O utilitário `decomposeCodigoHabilidade` extrai automaticamente os componentes
estruturais do código:

- **Etapa**: EI (Educação Infantil), EF (Ensino Fundamental) ou EM (Ensino
  Médio)
- **Anos**: Representação dos anos escolares (ex: '67' para 6º e 7º ano)
- **Componente curricular**: Sigla do componente (ex: 'LP' para Língua
  Portuguesa)
- **Sequência**: Número sequencial da habilidade

Além disso, o sistema inclui validação de formatos através da função
`validarCodigoBNCC`, que verifica se um código segue o padrão BNCC esperado. O
utilitário também fornece a função `getComponenteNome` para obter o nome
completo do componente curricular a partir de sua sigla.

```typescript
import {
  decomposeCodigoHabilidade,
  validarCodigoBNCC,
  getComponenteNome,
} from '@/core/domain/bncc';

// Decompor código de habilidade
const decomp = decomposeCodigoHabilidade('EF67LP08');
// { etapa: Etapa.EF, anos: [6, 7], componente: 'LP', sequencia: 8 }

// Validar formato do código
const valido = validarCodigoBNCC('EF67LP08'); // true

// Obter nome completo do componente
const nome = getComponenteNome('LP'); // 'Língua Portuguesa'
```

**Fontes da seção**

- [src/core/domain/bncc/decomposer.ts](file://src\core\domain\bncc\decomposer.ts#L0-L209)
- [src/core/domain/bncc/types.ts](file://src\core\domain\bncc\types.ts#L0-L223)

## Seleção de Habilidades por Componente Curricular e Série

A seleção de habilidades no VirtuQuest é um processo contextualizado, guiado por
dois filtros principais: o **componente curricular** (ex: História, Arte) e a
**série/ano escolar**. O sistema permite que o professor navegue por uma árvore
de conhecimento que reflete a estrutura oficial da BNCC.

O repositório BNCC fornece métodos especializados para filtrar habilidades:

- `listarHabilidadesPorComponente`: Retorna todas as habilidades de um
  componente curricular
- `listarHabilidadesPorAno`: Retorna habilidades de uma etapa e ano específico
- `buscarHabilidades`: Permite busca avançada com múltiplos critérios (etapa,
  anos, componente, texto)

Ao selecionar um componente curricular, o professor é apresentado às
competências específicas daquela área. Ao escolher uma série, o sistema filtra
as habilidades correspondentes àquela etapa de desenvolvimento. Essa
estruturação hierárquica (Área -> Competência -> Habilidade) garante que o
planejamento seja alinhado com as expectativas de aprendizagem adequadas à faixa
etária e ao conteúdo disciplinar.

```typescript
import { catalogoBNCC, Etapa, ComponenteCurricular } from '@/core/domain/bncc';

// Buscar habilidades por filtros
const habilidades = catalogoBNCC.buscarHabilidades({
  etapa: Etapa.EF,
  anos: [6, 7],
  componente: 'LP',
  texto: 'efeitos de sentido',
});
```

**Fontes da seção**

- [src/core/domain/bncc/repository.ts](file://src\core\domain\bncc\repository.ts#L25-L404)
- [src/core/domain/bncc/types.ts](file://src\core\domain\bncc\types.ts#L0-L223)

## Integração com Bloom e Virtudes

O diferencial do VirtuQuest está na integração simultânea dos três pilares:
BNCC, Taxonomia de Bloom e Virtudes Intelectuais. Quando uma habilidade da BNCC
é selecionada, o sistema sugere automaticamente os níveis cognitivos da
Taxonomia de Bloom Revisada (Lembrar, Compreender, Aplicar, Analisar, Avaliar,
Criar) que são mais adequados para desenvolvê-la.

Paralelamente, a plataforma recomenda Virtudes Intelectuais (como Curiosidade,
Humildade, Coragem) que podem ser cultivadas durante a aula. Essa integração
transforma o planejamento de uma simples lista de conteúdos em um processo
pedagógico holístico, onde o desenvolvimento cognitivo, afetivo e ético do aluno
são trabalhados em conjunto.

Os catálogos de Bloom e Virtudes também são implementados como agregados de
domínio, seguindo a mesma estrutura de repositório imutável. A integração entre
os pilares é otimizada para proporcionar uma experiência de planejamento fluida
e responsiva.

**Fontes da seção**

- [src/core/domain/README.md](file://src\core\domain\README.md#L43-L118)
- [src/core/domain/bloom/repository.ts](file://src\core\domain\bloom\repository.ts#L0-L175)

## Exemplo Prático de Vinculação de Habilidades

Considere um professor de História do 7º ano planejando uma aula. Ele acessa o
seletor de habilidades e escolhe o componente "História" e a série "7º ano". O
sistema exibe a habilidade **EF07HI16**: "Analisar os mecanismos e as dinâmicas
de comércio de escravizados...".

Ao selecionar esta habilidade, o VirtuQuest a vincula automaticamente ao nível
cognitivo **Analisar** da Taxonomia de Bloom, especificamente ao processo de
"Organizar" (compreender como elementos se ajustam em uma estrutura). Para as
Virtudes, a plataforma pode sugerir **Coragem** (para enfrentar temas difíceis)
e **Humildade** (para reconhecer perspectivas diferentes). O professor pode
então usar essas sugestões para formular objetivos de aprendizagem que vão além
do conteúdo factual, promovendo um pensamento crítico e reflexivo.

O sistema utiliza o repositório BNCC para acessar rapidamente os dados da
habilidade e seus metadados, garantindo uma experiência de planejamento ágil e
eficiente.

**Fontes da seção**

- [src/core/domain/bncc/repository.ts](file://src\core\domain\bncc\repository.ts#L25-L404)
- [src/core/domain/bloom/repository.ts](file://src\core\domain\bloom\repository.ts#L0-L175)

## Navegação no Seletor de Habilidades BNCC

Para utilizar o seletor de habilidades BNCC na interface do VirtuQuest, siga os
passos abaixo:

1.  **Acesse o Módulo de Planejamento:** Navegue até a seção de planejamento de
    aulas na plataforma.
2.  **Selecione o Componente Curricular:** Escolha a disciplina (ex: Matemática,
    Geografia) no menu suspenso.
3.  **Escolha a Série/Ano:** Selecione o ano escolar dos seus alunos.
4.  **Explore as Competências:** A interface exibirá as competências gerais e
    específicas da área. Clique para expandir.
5.  **Selecione a Habilidade:** Navegue pela lista de habilidades codificadas
    (ex: EF07MA17) e clique na que deseja vincular ao seu plano de aula.
6.  **Visualize as Integrações:** Após a seleção, o sistema mostrará as
    sugestões de níveis de Bloom e Virtudes Intelectuais relacionadas.

A interface é projetada para ser intuitiva, com cores distintas para cada pilar
(BNCC, Bloom, Virtudes) para facilitar a identificação visual, conforme definido
nas variáveis de estilo do sistema. O seletor utiliza o repositório BNCC para
carregar rapidamente as opções de habilidades, garantindo uma navegação suave
mesmo com grandes volumes de dados curriculares.

**Fontes da seção**

- [src/core/domain/bncc/repository.ts](file://src\core\domain\bncc\repository.ts#L25-L404)
- [src/styles/globals.css](file://src\styles\globals.css#L0-L103)
- [tailwind.config.ts](file://tailwind.config.ts#L40-L78)

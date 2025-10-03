# Base Nacional Comum Curricular

<cite>
**Arquivos Referenciados neste Documento**  
- [README.md](file://README.md)
- [docs/fundamentos/A Noção de Competência na BNCC.md](file://docs/fundamentos/A Noção de Competência na BNCC.md)
- [docs/fundamentos/Taxonomia de Bloom e BNCC.md](file://docs/fundamentos/Taxonomia de Bloom e BNCC.md)
- [src/styles/globals.css](file://src/styles/globals.css)
- [tailwind.config.ts](file://tailwind.config.ts)
</cite>

## Sumário

1. [Introdução](#introdução)
2. [Estrutura da BNCC no VirtuQuest](#estrutura-da-bncc-no-virtuquest)
3. [Seleção de Habilidades por Componente Curricular e Série](#seleção-de-habilidades-por-componente-curricular-e-série)
4. [Integração com Bloom e Virtudes](#integração-com-bloom-e-virtudes)
5. [Exemplo Prático de Vinculação de Habilidades](#exemplo-prático-de-vinculação-de-habilidades)
6. [Navegação no Seletor de Habilidades BNCC](#navegação-no-seletor-de-habilidades-bncc)
7. [Diagrama de Relação entre BNCC e Bloom](#diagrama-de-relação-entre-bncc-e-bloom)

## Introdução

O VirtuQuest é uma plataforma de planejamento pedagógico integrado que alinha as
diretrizes da Base Nacional Comum Curricular (BNCC) com a Taxonomia de Bloom e o
desenvolvimento de Virtudes Intelectuais. Este documento detalha como a BNCC é
implementada na aplicação, com foco na estruturação de competências e
habilidades, sua seleção contextualizada por componente curricular e série, e
sua integração com os demais pilares do sistema. A análise baseia-se nos
fundamentos pedagógicos fornecidos na documentação do projeto e na estrutura de
dados implícita no código.

**Seção fontes**

- [README.md](file://README.md#L0-L44)
- [docs/fundamentos/A Noção de Competência na BNCC.md](file://docs/fundamentos/A
  Noção de Competência na BNCC.md#L0-L320)

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

**Seção fontes**

- [docs/fundamentos/A Noção de Competência na BNCC.md](file://docs/fundamentos/A
  Noção de Competência na BNCC.md#L0-L320)
- [README.md](file://README.md#L0-L44)

## Seleção de Habilidades por Componente Curricular e Série

A seleção de habilidades no VirtuQuest é um processo contextualizado, guiado por
dois filtros principais: o **componente curricular** (ex: História, Arte) e a
**série/ano escolar**. O sistema permite que o professor navegue por uma árvore
de conhecimento que reflete a estrutura oficial da BNCC.

Ao selecionar um componente curricular, o professor é apresentado às
competências específicas daquela área. Ao escolher uma série, o sistema filtra
as habilidades correspondentes àquela etapa de desenvolvimento. Essa
estruturação hierárquica (Área -> Competência -> Habilidade) garante que o
planejamento seja alinhado com as expectativas de aprendizagem adequadas à faixa
etária e ao conteúdo disciplinar.

**Seção fontes**

- [docs/fundamentos/A Noção de Competência na BNCC.md](file://docs/fundamentos/A
  Noção de Competência na BNCC.md#L0-L320)
- [docs/fundamentos/Taxonomia de Bloom e
  BNCC.md](file://docs/fundamentos/Taxonomia de Bloom e BNCC.md#L0-L787)

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

**Seção fontes**

- [README.md](file://README.md#L0-L44)
- [docs/fundamentos/Taxonomia de Bloom e
  BNCC.md](file://docs/fundamentos/Taxonomia de Bloom e BNCC.md#L0-L787)

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

**Seção fontes**

- [docs/fundamentos/Taxonomia de Bloom e
  BNCC.md](file://docs/fundamentos/Taxonomia de Bloom e BNCC.md#L0-L787)
- [README.md](file://README.md#L0-L44)

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
nas variáveis de estilo do sistema.

**Seção fontes**

- [src/styles/globals.css](file://src/styles/globals.css#L0-L103)
- [tailwind.config.ts](file://tailwind.config.ts#L40-L78)

## Diagrama de Relação entre BNCC e Bloom

O diagrama abaixo ilustra a relação bidimensional entre as habilidades da BNCC e
os níveis cognitivos da Taxonomia de Bloom Revisada, conforme analisado nos
documentos de fundamentos.

```mermaid
flowchart TD
subgraph BNCC_Habilidades [Habilidades da BNCC]
A["EF07HI16: Analisar mecanismos do comércio de escravizados"]
B["EF07MA17: Resolver e elaborar problemas de proporcionalidade"]
C["EF09LI08: Analisar qualidade de informações em ambientes virtuais"]
end
subgraph Taxonomia_Bloom [Taxonomia de Bloom Revisada]
D["Analisar (4)"]
E["Criar (6)"]
F["Avaliar (5)"]
end
A --> D
B --> E
C --> F
style A fill:#15803d,stroke:#166534,color:white
style B fill:#15803d,stroke:#166534,color:white
style C fill:#15803d,stroke:#166534,color:white
style D fill:#b45309,stroke:#92400e,color:white
style E fill:#b45309,stroke:#92400e,color:white
style F fill:#b45309,stroke:#92400e,color:white
click A "docs/fundamentos/Taxonomia de Bloom e BNCC.md#L0-L787"
click B "docs/fundamentos/Taxonomia de Bloom e BNCC.md#L0-L787"
click C "docs/fundamentos/Taxonomia de Bloom e BNCC.md#L0-L787"
```

**Fontes do Diagrama**

- [docs/fundamentos/Taxonomia de Bloom e
  BNCC.md](file://docs/fundamentos/Taxonomia de Bloom e BNCC.md#L0-L787)
- [src/styles/globals.css](file://src/styles/globals.css#L0-L103)

**Seção fontes**

- [docs/fundamentos/Taxonomia de Bloom e
  BNCC.md](file://docs/fundamentos/Taxonomia de Bloom e BNCC.md#L0-L787)

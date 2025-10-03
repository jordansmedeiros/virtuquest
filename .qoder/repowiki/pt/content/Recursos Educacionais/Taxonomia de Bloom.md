# Taxonomia de Bloom

<cite>
**Arquivos Referenciados neste Documento**   
- [README.md](file://README.md)
- [page.tsx](file://src/app/page.tsx)
- [bloom-indicator.tsx](file://src/components/educational/bloom-indicator.tsx) - *Componente de interface para níveis Bloom*
- [catalog-cache.ts](file://src/core/infrastructure/cache/catalog-cache.ts) - *Implementação do cache para catálogos educacionais*
- [client.ts](file://src/core/infrastructure/n8n/client.ts) - *Cliente N8N com integração de cache Bloom*
- [use-static-catalog.ts](file://src/hooks/use-static-catalog.ts) - *Hooks para acesso a catálogos estáticos*
- [types.ts](file://src/core/domain/bloom/types.ts) - *Tipos da Taxonomia de Bloom Revisada*
- [matriz.ts](file://src/core/domain/bloom/matriz.ts) - *Matriz bidimensional completa de Bloom*
- [repository.ts](file://src/core/domain/bloom/repository.ts) - *Repositório estático com 200+ verbos mapeados*
- [index.ts](file://src/core/domain/bloom/index.ts) - *Exportação do agregado Bloom*
</cite>

## Atualização do Sumário

**Alterações Realizadas**

- Atualização da seção **Estrutura da Taxonomia de Bloom no VirtuQuest** com
  detalhes sobre a matriz bidimensional e repositório
- Atualização da seção **Implementação dos Níveis Cognitivos** com subprocessos
  e tipos de conhecimento
- Adição da seção **Matriz Bidimensional de Bloom** detalhando a estrutura
  completa
- Atualização da tabela de verbos com base na matriz completa
- Adição de seção sobre **Validação de Progressão Cognitiva**
- Atualização das fontes por seção com base nas alterações de código

## Sumário

1. [Introdução](#introdução)
2. [Estrutura da Taxonomia de Bloom no VirtuQuest](#estrutura-da-taxonomia-de-bloom-no-virtuquest)
3. [Matriz Bidimensional de Bloom](#matriz-bidimensional-de-bloom)
4. [Implementação dos Níveis Cognitivos](#implementação-dos-níveis-cognitivos)
5. [Integração com BNCC e Virtudes Intelectuais](#integração-com-bncc-e-virtudes-intelectuais)
6. [Validação de Progressão Cognitiva](#validação-de-progressão-cognitiva)
7. [Uso da IA para Sugestão de Atividades](#uso-da-ia-para-sugestão-de-atividades)
8. [Orientações para Professores](#orientações-para-professores)
9. [Conclusão](#conclusão)

## Introdução

O VirtuQuest é uma plataforma de planejamento pedagógico integrado que combina
três pilares fundamentais da educação contemporânea: a Base Nacional Comum
Curricular (BNCC), a Taxonomia de Bloom (revisada) e o desenvolvimento de
Virtudes Intelectuais. Este documento detalha como a Taxonomia de Bloom é
aplicada na plataforma para estruturar objetivos de aprendizagem, orientar a
criação de atividades e avaliações, e potencializar o uso de inteligência
artificial no suporte ao professor.

A versão revisada da Taxonomia de Bloom organiza os processos cognitivos em seis
níveis hierárquicos: **lembrar**, **entender**, **aplicar**, **analisar**,
**avaliar** e **criar**. No VirtuQuest, esses níveis são utilizados como um
framework para alinhar as metas de ensino com práticas pedagógicas eficazes,
permitindo um planejamento mais intencional e direcionado.

**Fontes da seção**

- [README.md](file://README.md#L1-L20)

## Estrutura da Taxonomia de Bloom no VirtuQuest

A Taxonomia de Bloom está integrada ao núcleo da lógica de domínio do
VirtuQuest, conforme indicado na estrutura de diretórios do projeto. O caminho
`src/core/domain/bloom/` contém uma implementação completa do agregado Bloom,
com modelos conceituais robustos baseados na versão revisada de Anderson &
Krathwohl (2001). A implementação inclui uma matriz bidimensional com 24 células
resultantes da combinação de 6 processos cognitivos e 4 tipos de conhecimento.

A plataforma permite que professores selecionem um ou mais níveis cognitivos ao
planejar uma aula ou atividade, criando uma abordagem multidimensional para o
aprendizado. Essa seleção influencia diretamente as sugestões fornecidas pela
IA, garantindo que as tarefas propostas estejam alinhadas com os objetivos
cognitivos definidos.

A implementação inclui um sistema de cache especializado em
`src/core/infrastructure/cache/catalog-cache.ts` que armazena os catálogos
educacionais, incluindo o catálogo Bloom. A classe `EducationalCatalogCache`
gerencia o cache para os três catálogos principais (BNCC, Bloom e Virtudes), com
TTLs configuráveis através das variáveis de ambiente `CACHE_TTL_BNCC`,
`CACHE_TTL_BLOOM` e `CACHE_TTL_VIRTUDES`.

O acesso ao catálogo Bloom é otimizado através de métodos públicos como
`getBloom()` e `setBloomCatalog()`, que permitem recuperação e armazenamento
eficiente dos dados. O sistema de cache implementa políticas de expiração e
invalidação, com suporte a monitoramento de estatísticas como hits, misses e
taxa de acerto.

**Fontes da seção**

- [catalog-cache.ts](file://src/core/infrastructure/cache/catalog-cache.ts#L236-L390) -
  _Implementação da classe EducationalCatalogCache_
- [client.ts](file://src/core/infrastructure/n8n/client.ts#L125-L631) -
  _Integração do cache com o cliente N8N_
- [use-static-catalog.ts](file://src/hooks/use-static-catalog.ts#L141-L147) -
  _Hook useBloomCatalog para acesso ao catálogo_

## Matriz Bidimensional de Bloom

O VirtuQuest implementa a versão revisada da Taxonomia de Bloom como uma matriz
bidimensional, conforme proposto por Anderson & Krathwohl (2001). Esta estrutura
combina dois eixos:

1. **Eixo Cognitivo**: 6 processos cognitivos em ordem crescente de complexidade
2. **Eixo do Conhecimento**: 4 tipos de conhecimento

A combinação resulta em 24 células taxonômicas únicas, cada uma representando
uma interseção específica entre um processo cognitivo e um tipo de conhecimento.
Cada célula possui:

- Código único (ex: 'B4' = Conhecimento Conceitual × Analisar)
- Descrição da interseção
- Exemplos educacionais contextualizados
- Verbos característicos

Os tipos de conhecimento são:

- **Factual (A)**: Terminologia e fatos específicos
- **Conceitual (B)**: Classificações, princípios, teorias
- **Procedimental (C)**: Algoritmos, técnicas, métodos
- **Metacognitivo (D)**: Estratégias e autoconsciência

Esta matriz bidimensional está implementada em `src/core/domain/bloom/matriz.ts`
como `MATRIZ_BLOOM_COMPLETA`, com 200+ verbos mapeados e exemplos
contextualizados para a educação brasileira.

**Fontes da seção**

- [types.ts](file://src/core/domain/bloom/types.ts#L1-L257) - _Definição dos
  tipos ProcessoCognitivo e TipoConhecimento_
- [matriz.ts](file://src/core/domain/bloom/matriz.ts#L0-L506) - _Implementação
  da matriz completa com 24 células_
- [matriz.ts](file://src/core/domain/bloom/matriz.ts#L10-L20) - _Documentação da
  matriz bidimensional_

## Implementação dos Níveis Cognitivos

Cada nível da Taxonomia de Bloom é implementado no VirtuQuest como um componente
estrutural do planejamento pedagógico. A seguir, detalhamos cada nível e sua
aplicação prática na plataforma.

### Nível 1: Lembrar

O nível de **lembrar** envolve o reconhecimento e a recordação de informações.
No VirtuQuest, este nível é associado a verbos como "identificar", "listar",
"nomear" e "repetir". Atividades sugeridas incluem quizzes de múltipla escolha,
flashcards e exercícios de associação.

Subprocessos deste nível incluem: **reconhecer** e **recordar**.

### Nível 2: Entender

O nível de **entender** foca na compreensão do significado das informações.
Verbos cognitivos incluem "explicar", "resumir", "parafrasear" e "comparar". A
IA pode sugerir atividades como resumos de textos, mapas conceituais ou
discussões em grupo para verificar a compreensão.

Subprocessos deste nível incluem: **interpretar**, **exemplificar**,
**classificar**, **resumir**, **inferir**, **comparar** e **explicar**.

### Nível 3: Aplicar

No nível de **aplicar**, os alunos utilizam conhecimentos em novas situações.
Verbos como "implementar", "demonstrar", "resolver" e "usar" são utilizados.
Exemplos de tarefas incluem problemas matemáticos contextualizados, simulações
ou projetos práticos.

Subprocessos deste nível incluem: **executar** e **implementar**.

### Nível 4: Analisar

O nível de **analisar** envolve a quebra de informações em partes para explorar
relações. Verbos incluem "diferenciar", "organizar", "comparar" e "investigar".
A plataforma pode sugerir análise de casos, comparação de fontes ou desmontagem
de argumentos.

Subprocessos deste nível incluem: **diferenciar**, **organizar** e **atribuir**.

### Nível 5: Avaliar

No nível de **avaliar**, os alunos fazem julgamentos baseados em critérios.
Verbos como "avaliar", "justificar", "defender" e "criticar" são apropriados.
Atividades incluem debates, revisão por pares ou avaliação de soluções
alternativas.

Subprocessos deste nível incluem: **checar** e **criticar**.

### Nível 6: Criar

O nível mais alto, **criar**, envolve a produção de algo novo. Verbos incluem
"projetar", "construir", "desenvolver" e "inventar". A IA pode sugerir projetos
interdisciplinares, criação de protótipos ou desenvolvimento de campanhas
sociais.

Subprocessos deste nível incluem: **gerar**, **planejar** e **produzir**.

Os níveis cognitivos são implementados como um enum `ProcessoCognitivo` no
arquivo `types.ts`, com valores numéricos de 1 a 6. O componente
`BloomIndicator` exibe visualmente o nível selecionado, com cores e ícones
específicos para cada nível, conforme definido nas variáveis CSS
`--bloom-lembrar`, `--bloom-entender`, etc.

O componente `BloomProgression` exibe a progressão através dos níveis,
destacando os níveis ativos e o nível atual, permitindo uma visualização clara
da progressão cognitiva planejada.

**Fontes da seção**

- [bloom-indicator.tsx](file://src/components/educational/bloom-indicator.tsx#L0-L180) -
  _Implementação dos componentes BloomIndicator e BloomProgression_
- [types.ts](file://src/core/domain/bloom/types.ts#L15-L40) - _Definição do enum
  ProcessoCognitivo_
- [types.ts](file://src/core/domain/bloom/types.ts#L45-L105) - _Definição dos
  tipos de subprocessos_
- [matriz.ts](file://src/core/domain/bloom/matriz.ts#L10-L20) - _Documentação da
  matriz bidimensional_

## Integração com BNCC e Virtudes Intelectuais

A verdadeira inovação do VirtuQuest está na integração simultânea da Taxonomia
de Bloom com a BNCC e as Virtudes Intelectuais. Quando um professor seleciona
uma habilidade da BNCC, a plataforma sugere automaticamente níveis cognitivos
apropriados e virtudes intelectuais relacionadas, como curiosidade, rigor
intelectual ou abertura de pensamento.

Essa triangulação pedagógica permite um planejamento mais rico e holístico, onde
o desenvolvimento cognitivo é acompanhado pelo fortalecimento do caráter
intelectual do aluno. Por exemplo, ao trabalhar com argumentação (BNCC), o
professor pode focar no nível de "avaliar" (Bloom) enquanto desenvolve a virtude
da "justiça intelectual".

O sistema de cache implementado em `EducationalCatalogCache` gerencia
conjuntamente os três catálogos, permitindo que a plataforma acesse rapidamente
as informações necessárias para essa integração. Os métodos `hydrate()` e
`isHydrated()` garantem que todos os catálogos estejam disponíveis e
sincronizados antes do uso.

A integração é facilitada pelo repositório `catalogoBloom`, que fornece acesso
imutável aos dados da taxonomia, incluindo o mapeamento de verbos para processos
cognitivos, permitindo que a IA analise objetivos de aprendizagem e os
classifique automaticamente.

**Fontes da seção**

- [catalog-cache.ts](file://src/core/infrastructure/cache/catalog-cache.ts#L236-L390) -
  _Implementação da integração de catálogos no EducationalCatalogCache_
- [client.ts](file://src/core/infrastructure/n8n/client.ts#L125-L631) - _Métodos
  públicos para acesso integrado aos catálogos_
- [repository.ts](file://src/core/domain/bloom/repository.ts#L1-L20) -
  _Descrição do repositório estático com integração tripla_

## Validação de Progressão Cognitiva

O VirtuQuest inclui funcionalidades avançadas para validar a progressão
cognitiva planejada pelos professores. O repositório `catalogoBloom` implementa
métodos de análise que verificam se a sequência de níveis cognitivos segue uma
progressão lógica e pedagogicamente adequada.

O método `validarProgressao()` analisa uma sequência de processos cognitivos e
identifica problemas como:

- **Saltos cognitivos muito grandes** (mais de 2 níveis de diferença)
- **Regressões cognitivas** (retornos a níveis inferiores sem justificativa)

Por exemplo, uma progressão de "Lembrar" (1) diretamente para "Analisar" (4)
seria considerada problemática devido ao salto de 3 níveis, enquanto uma
regressão de "Avaliar" (5) para "Entender" (2) seria identificada como uma
regressão cognitiva.

O sistema também fornece o método `sugerirProgressao()` que recomenda níveis
subsequentes a partir de um processo cognitivo atual, promovendo uma construção
gradual do conhecimento.

Além disso, o método `calcularComplexidadeCognitiva()` calcula um score médio de
complexidade para uma sequência de processos, ajudando professores a equilibrar
o nível de desafio cognitivo nas atividades planejadas.

**Fontes da seção**

- [repository.ts](file://src/core/domain/bloom/repository.ts#L100-L144) -
  _Implementação dos métodos validarProgressao, sugerirProgressao e
  calcularComplexidadeCognitiva_
- [repository.ts](file://src/core/domain/bloom/repository.ts#L145-L174) -
  _Implementação do método auxiliar getNomeProcesso_
- [index.ts](file://src/core/domain/bloom/index.ts#L16) - _Exportação do
  repositório catalogoBloom_

## Uso da IA para Sugestão de Atividades

A inteligência artificial no VirtuQuest utiliza os níveis cognitivos
selecionados para gerar sugestões de atividades, avaliações e recursos. A
relação entre verbos cognitivos e tipos de tarefas é codificada no sistema
através do repositório `catalogoBloom`, que contém um índice reverso mapeando
mais de 200 verbos para seus respectivos processos cognitivos.

O repositório utiliza um `Map<string, ProcessoCognitivo>` para classificar
verbos, com normalização para busca (minúsculas, remoção de acentos). Isso
permite que a IA identifique automaticamente o nível cognitivo a partir de
verbos usados nos objetivos de aprendizagem.

Por exemplo, se o professor seleciona o verbo "analisar", a IA pode sugerir:

- Uma atividade de comparação entre dois textos históricos
- Um questionário com perguntas de inferência
- Um projeto de pesquisa com coleta e organização de dados

Essas sugestões são personalizadas com base na disciplina, série e habilidades
da BNCC selecionadas, garantindo relevância e aplicabilidade prática.

O acesso ao catálogo Bloom pela IA é otimizado através do sistema de cache. O
método `fetchBloomCatalog()` no `N8NClient` verifica primeiro o cache antes de
fazer uma requisição ao serviço N8N, melhorando significativamente o desempenho.
O hook `useBloomCatalog` fornece uma interface simples para componentes React
acessarem o catálogo, com suporte a carregamento assíncrono e tratamento de
erros.

A integração do cache com o N8NClient permite que as sugestões da IA sejam
geradas rapidamente, mesmo com grandes volumes de dados. A invalidação seletiva
através de `invalidateBloomCatalog()` garante que a IA sempre tenha acesso a
dados atualizados quando necessário.

**Fontes da seção**

- [client.ts](file://src/core/infrastructure/n8n/client.ts#L500-L520) -
  _Implementação do fetchBloomCatalog com cache_
- [use-static-catalog.ts](file://src/hooks/use-static-catalog.ts#L141-L147) -
  _Hook useBloomCatalog para acesso ao catálogo Bloom_
- [client.ts](file://src/core/infrastructure/n8n/client.ts#L550-L555) - _Método
  hydrateCatalogs para carregamento em paralelo_
- [repository.ts](file://src/core/domain/bloom/repository.ts#L25-L45) -
  _Implementação do índice reverso de verbos_

## Orientações para Professores

Para aproveitar ao máximo a Taxonomia de Bloom no VirtuQuest, recomenda-se:

1. **Começar com os objetivos**: Defina claramente qual nível cognitivo deseja
   desenvolver.
2. **Combinar níveis**: Use múltiplos níveis em uma mesma sequência didática
   para promover aprendizagem profunda.
3. **Alinhar com a BNCC**: Sempre relacione os objetivos cognitivos com as
   habilidades curriculares.
4. **Explorar sugestões da IA**: Utilize as recomendações como ponto de partida,
   adaptando-as ao contexto da turma.
5. **Avaliar com critério**: Escolha instrumentos de avaliação que correspondam
   ao nível cognitivo esperado.

### Tabela de Verbos por Nível Cognitivo

| Nível Cognitivo | Verbos Sugeridos                                                                                                                      | Tipos de Tarefas                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Lembrar         | reconhecer, recordar, listar, nomear, identificar, recuperar, localizar, memorizar, relembrar, rotular                                | quizzes, flashcards, exercícios de memorização, listas          |
| Entender        | interpretar, exemplificar, classificar, resumir, inferir, comparar, explicar, parafrasear, traduzir, descrever, ilustrar, generalizar | mapas conceituais, resumos, discussões, parafraseamento         |
| Aplicar         | executar, implementar, usar, demonstrar, resolver, aplicar, empregar, praticar, operar                                                | problemas contextualizados, simulações, experimentos, práticas  |
| Analisar        | diferenciar, organizar, atribuir, comparar, contrastar, desconstruir, categorizar, examinar, distinguir, investigar                   | análise de casos, comparação de fontes, gráficos, desconstrução |
| Avaliar         | checar, criticar, julgar, avaliar, testar, detectar, monitorar, revisar, verificar, validar                                           | debates, revisão por pares, julgamentos, autoavaliação          |
| Criar           | gerar, planejar, produzir, projetar, construir, formular, desenvolver, inventar, compor, elaborar                                     | projetos, protótipos, campanhas, invenções, composições         |

**Fontes da seção**

- [README.md](file://README.md#L1-L277)
- [matriz.ts](file://src/core/domain/bloom/matriz.ts#L100-L400) - _Verbos por
  processo cognitivo_
- [repository.ts](file://src/core/domain/bloom/repository.ts#L70-L100) - _Método
  getVerbosPorProcesso_

## Conclusão

A aplicação da Taxonomia de Bloom no VirtuQuest representa um avanço
significativo no planejamento pedagógico digital. Ao estruturar os objetivos de
aprendizagem em níveis cognitivos claros, integrar com a BNCC e vincular ao
desenvolvimento de Virtudes Intelectuais, a plataforma oferece uma abordagem
completa e intencional para a educação. Com o apoio da IA, os professores podem
criar experiências de aprendizagem mais eficazes, alinhadas com as melhores
práticas da pedagogia contemporânea.

A implementação técnica com sistema de cache otimizado garante desempenho e
escalabilidade, enquanto os componentes de interface fornecem uma experiência de
usuário intuitiva. A integração entre os diferentes sistemas (cache, N8N, hooks)
demonstra uma arquitetura bem projetada que suporta os objetivos pedagógicos da
plataforma. A matriz bidimensional completa com 24 células e o repositório com
200+ verbos mapeados proporcionam uma base sólida para análise e sugestão de
atividades, tornando o VirtuQuest uma ferramenta poderosa para o planejamento
pedagógico moderno.

# Taxonomia de Bloom

<cite>
**Arquivos Referenciados neste Documento**   
- [README.md](file://README.md)
- [page.tsx](file://src/app/page.tsx)
- [bloom-indicator.tsx](file://src/components/educational/bloom-indicator.tsx) - *Componente de interface para níveis Bloom*
- [catalog-cache.ts](file://src/core/infrastructure/cache/catalog-cache.ts) - *Implementação do cache para catálogos educacionais*
- [client.ts](file://src/core/infrastructure/n8n/client.ts) - *Cliente N8N com integração de cache Bloom*
- [use-static-catalog.ts](file://src/hooks/use-static-catalog.ts) - *Hooks para acesso a catálogos estáticos*
</cite>

## Atualização do Sumário

**Alterações Realizadas**

- Atualização da seção **Estrutura da Taxonomia de Bloom no VirtuQuest** com
  detalhes sobre o sistema de cache
- Atualização da seção **Uso da IA para Sugestão de Atividades** com informações
  sobre integração de cache
- Adição de detalhes técnicos sobre a implementação do cache e acesso aos
  catálogos
- Atualização das fontes por seção com base nas alterações de código

## Sumário

1. [Introdução](#introdução)
2. [Estrutura da Taxonomia de Bloom no VirtuQuest](#estrutura-da-taxonomia-de-bloom-no-virtuquest)
3. [Implementação dos Níveis Cognitivos](#implementação-dos-níveis-cognitivos)
4. [Integração com BNCC e Virtudes Intelectuais](#integração-com-bncc-e-virtudes-intelectuais)
5. [Uso da IA para Sugestão de Atividades](#uso-da-ia-para-sugestão-de-atividades)
6. [Orientações para Professores](#orientações-para-professores)
7. [Conclusão](#conclusão)

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
`src/core/domain/` sugere que os modelos conceituais da BNCC, Bloom e Virtudes
Intelectuais são tratados como entidades centrais do sistema. Embora os arquivos
específicos ainda não tenham sido implementados, a documentação e a estrutura do
projeto indicam claramente a intenção de modelar esses domínios de forma robusta
e interconectada.

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

## Implementação dos Níveis Cognitivos

Cada nível da Taxonomia de Bloom é implementado no VirtuQuest como um componente
estrutural do planejamento pedagógico. A seguir, detalhamos cada nível e sua
aplicação prática na plataforma.

### Nível 1: Lembrar

O nível de **lembrar** envolve o reconhecimento e a recordação de informações.
No VirtuQuest, este nível é associado a verbos como "identificar", "listar",
"nomear" e "repetir". Atividades sugeridas incluem quizzes de múltipla escolha,
flashcards e exercícios de associação.

### Nível 2: Entender

O nível de **entender** foca na compreensão do significado das informações.
Verbos cognitivos incluem "explicar", "resumir", "parafrasear" e "comparar". A
IA pode sugerir atividades como resumos de textos, mapas conceituais ou
discussões em grupo para verificar a compreensão.

### Nível 3: Aplicar

No nível de **aplicar**, os alunos utilizam conhecimentos em novas situações.
Verbos como "implementar", "demonstrar", "resolver" e "usar" são utilizados.
Exemplos de tarefas incluem problemas matemáticos contextualizados, simulações
ou projetos práticos.

### Nível 4: Analisar

O nível de **analisar** envolve a quebra de informações em partes para explorar
relações. Verbos incluem "diferenciar", "organizar", "comparar" e "investigar".
A plataforma pode sugerir análise de casos, comparação de fontes ou desmontagem
de argumentos.

### Nível 5: Avaliar

No nível de **avaliar**, os alunos fazem julgamentos baseados em critérios.
Verbos como "avaliar", "justificar", "defender" e "criticar" são apropriados.
Atividades incluem debates, revisão por pares ou avaliação de soluções
alternativas.

### Nível 6: Criar

O nível mais alto, **criar**, envolve a produção de algo novo. Verbos incluem
"projetar", "construir", "desenvolver" e "inventar". A IA pode sugerir projetos
interdisciplinares, criação de protótipos ou desenvolvimento de campanhas
sociais.

Os níveis cognitivos são implementados como um tipo enumerado `BloomLevel` no
componente `bloom-indicator.tsx`, com valores: 'lembrar', 'entender', 'aplicar',
'analisar', 'avaliar', 'criar'. O componente `BloomIndicator` exibe visualmente
o nível selecionado, com cores e ícones específicos para cada nível, conforme
definido nas variáveis CSS `--bloom-lembrar`, `--bloom-entender`, etc.

O componente `BloomProgression` exibe a progressão através dos níveis,
destacando os níveis ativos e o nível atual, permitindo uma visualização clara
da progressão cognitiva planejada.

**Fontes da seção**

- [bloom-indicator.tsx](file://src/components/educational/bloom-indicator.tsx#L0-L180) -
  _Implementação dos componentes BloomIndicator e BloomProgression_
- [types.ts](file://src/core/infrastructure/n8n/types.ts#L414-L416) - _Definição
  da interface CatalogoBloom_

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

**Fontes da seção**

- [catalog-cache.ts](file://src/core/infrastructure/cache/catalog-cache.ts#L236-L390) -
  _Implementação da integração de catálogos no EducationalCatalogCache_
- [client.ts](file://src/core/infrastructure/n8n/client.ts#L125-L631) - _Métodos
  públicos para acesso integrado aos catálogos_

## Uso da IA para Sugestão de Atividades

A inteligência artificial no VirtuQuest utiliza os níveis cognitivos
selecionados para gerar sugestões de atividades, avaliações e recursos. A
relação entre verbos cognitivos e tipos de tarefas é codificada no sistema,
permitindo que a IA recomende ações pedagógicas alinhadas com os objetivos
definidos.

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

| Nível Cognitivo | Verbos Sugeridos                             | Tipos de Tarefas                                     |
| --------------- | -------------------------------------------- | ---------------------------------------------------- |
| Lembrar         | identificar, listar, nomear, repetir         | quizzes, flashcards, exercícios de memorização       |
| Entender        | explicar, resumir, parafrasear, comparar     | mapas conceituais, resumos, discussões               |
| Aplicar         | implementar, demonstrar, resolver, usar      | problemas contextualizados, simulações, experimentos |
| Analisar        | diferenciar, organizar, comparar, investigar | análise de casos, comparação de fontes, gráficos     |
| Avaliar         | avaliar, justificar, defender, criticar      | debates, revisão por pares, julgamentos              |
| Criar           | projetar, construir, desenvolver, inventar   | projetos, protótipos, campanhas, invenções           |

**Fontes da seção**

- [README.md](file://README.md#L1-L277)

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
plataforma.

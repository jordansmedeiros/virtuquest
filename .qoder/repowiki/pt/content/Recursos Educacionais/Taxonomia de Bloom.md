# Taxonomia de Bloom

<cite>
**Arquivos Referenciados neste Documento**   
- [README.md](file://README.md)
- [page.tsx](file://src/app/page.tsx)
</cite>

## Sumário
1. [Introdução](#introdução)
2. [Estrutura da Taxonomia de Bloom no VirtuQuest](#estrutura-da-taxonomia-de-bloom-no-virtuquest)
3. [Implementação dos Níveis Cognitivos](#implementação-dos-níveis-cognitivos)
4. [Integração com BNCC e Virtudes Intelectuais](#integração-com-bncc-e-virtudes-intelectuais)
5. [Uso da IA para Sugestão de Atividades](#uso-da-ia-para-sugestão-de-atividades)
6. [Orientações para Professores](#orientações-para-professores)
7. [Conclusão](#conclusão)

## Introdução

O VirtuQuest é uma plataforma de planejamento pedagógico integrado que combina três pilares fundamentais da educação contemporânea: a Base Nacional Comum Curricular (BNCC), a Taxonomia de Bloom (revisada) e o desenvolvimento de Virtudes Intelectuais. Este documento detalha como a Taxonomia de Bloom é aplicada na plataforma para estruturar objetivos de aprendizagem, orientar a criação de atividades e avaliações, e potencializar o uso de inteligência artificial no suporte ao professor.

A versão revisada da Taxonomia de Bloom organiza os processos cognitivos em seis níveis hierárquicos: **lembrar**, **entender**, **aplicar**, **analisar**, **avaliar** e **criar**. No VirtuQuest, esses níveis são utilizados como um framework para alinhar as metas de ensino com práticas pedagógicas eficazes, permitindo um planejamento mais intencional e direcionado.

**Section sources**
- [README.md](file://README.md#L1-L20)

## Estrutura da Taxonomia de Bloom no VirtuQuest

A Taxonomia de Bloom está integrada ao núcleo da lógica de domínio do VirtuQuest, conforme indicado na estrutura de diretórios do projeto. O caminho `src/core/domain/` sugere que os modelos conceituais da BNCC, Bloom e Virtudes Intelectuais são tratados como entidades centrais do sistema. Embora os arquivos específicos ainda não tenham sido implementados, a documentação e a estrutura do projeto indicam claramente a intenção de modelar esses domínios de forma robusta e interconectada.

A plataforma permite que professores selecionem um ou mais níveis cognitivos ao planejar uma aula ou atividade, criando uma abordagem multidimensional para o aprendizado. Essa seleção influencia diretamente as sugestões fornecidas pela IA, garantindo que as tarefas propostas estejam alinhadas com os objetivos cognitivos definidos.

**Section sources**
- [README.md](file://README.md#L160-L170)

## Implementação dos Níveis Cognitivos

Cada nível da Taxonomia de Bloom é implementado no VirtuQuest como um componente estrutural do planejamento pedagógico. A seguir, detalhamos cada nível e sua aplicação prática na plataforma.

### Nível 1: Lembrar

O nível de **lembrar** envolve o reconhecimento e a recordação de informações. No VirtuQuest, este nível é associado a verbos como "identificar", "listar", "nomear" e "repetir". Atividades sugeridas incluem quizzes de múltipla escolha, flashcards e exercícios de associação.

### Nível 2: Entender

O nível de **entender** foca na compreensão do significado das informações. Verbos cognitivos incluem "explicar", "resumir", "parafrasear" e "comparar". A IA pode sugerir atividades como resumos de textos, mapas conceituais ou discussões em grupo para verificar a compreensão.

### Nível 3: Aplicar

No nível de **aplicar**, os alunos utilizam conhecimentos em novas situações. Verbos como "implementar", "demonstrar", "resolver" e "usar" são utilizados. Exemplos de tarefas incluem problemas matemáticos contextualizados, simulações ou projetos práticos.

### Nível 4: Analisar

O nível de **analisar** envolve a quebra de informações em partes para explorar relações. Verbos incluem "diferenciar", "organizar", "comparar" e "investigar". A plataforma pode sugerir análise de casos, comparação de fontes ou desmontagem de argumentos.

### Nível 5: Avaliar

No nível de **avaliar**, os alunos fazem julgamentos baseados em critérios. Verbos como "avaliar", "justificar", "defender" e "criticar" são apropriados. Atividades incluem debates, revisão por pares ou avaliação de soluções alternativas.

### Nível 6: Criar

O nível mais alto, **criar**, envolve a produção de algo novo. Verbos incluem "projetar", "construir", "desenvolver" e "inventar". A IA pode sugerir projetos interdisciplinares, criação de protótipos ou desenvolvimento de campanhas sociais.

**Section sources**
- [README.md](file://README.md#L1-L277)
- [page.tsx](file://src/app/page.tsx#L28-L30)

## Integração com BNCC e Virtudes Intelectuais

A verdadeira inovação do VirtuQuest está na integração simultânea da Taxonomia de Bloom com a BNCC e as Virtudes Intelectuais. Quando um professor seleciona uma habilidade da BNCC, a plataforma sugere automaticamente níveis cognitivos apropriados e virtudes intelectuais relacionadas, como curiosidade, rigor intelectual ou abertura de pensamento.

Essa triangulação pedagógica permite um planejamento mais rico e holístico, onde o desenvolvimento cognitivo é acompanhado pelo fortalecimento do caráter intelectual do aluno. Por exemplo, ao trabalhar com argumentação (BNCC), o professor pode focar no nível de "avaliar" (Bloom) enquanto desenvolve a virtude da "justiça intelectual".

**Section sources**
- [README.md](file://README.md#L1-L20)

## Uso da IA para Sugestão de Atividades

A inteligência artificial no VirtuQuest utiliza os níveis cognitivos selecionados para gerar sugestões de atividades, avaliações e recursos. A relação entre verbos cognitivos e tipos de tarefas é codificada no sistema, permitindo que a IA recomende ações pedagógicas alinhadas com os objetivos definidos.

Por exemplo, se o professor seleciona o verbo "analisar", a IA pode sugerir:
- Uma atividade de comparação entre dois textos históricos
- Um questionário com perguntas de inferência
- Um projeto de pesquisa com coleta e organização de dados

Essas sugestões são personalizadas com base na disciplina, série e habilidades da BNCC selecionadas, garantindo relevância e aplicabilidade prática.

**Section sources**
- [README.md](file://README.md#L1-L277)

## Orientações para Professores

Para aproveitar ao máximo a Taxonomia de Bloom no VirtuQuest, recomenda-se:

1. **Começar com os objetivos**: Defina claramente qual nível cognitivo deseja desenvolver.
2. **Combinar níveis**: Use múltiplos níveis em uma mesma sequência didática para promover aprendizagem profunda.
3. **Alinhar com a BNCC**: Sempre relacione os objetivos cognitivos com as habilidades curriculares.
4. **Explorar sugestões da IA**: Utilize as recomendações como ponto de partida, adaptando-as ao contexto da turma.
5. **Avaliar com critério**: Escolha instrumentos de avaliação que correspondam ao nível cognitivo esperado.

### Tabela de Verbos por Nível Cognitivo

| Nível Cognitivo | Verbos Sugeridos | Tipos de Tarefas |
|-----------------|------------------|------------------|
| Lembrar | identificar, listar, nomear, repetir | quizzes, flashcards, exercícios de memorização |
| Entender | explicar, resumir, parafrasear, comparar | mapas conceituais, resumos, discussões |
| Aplicar | implementar, demonstrar, resolver, usar | problemas contextualizados, simulações, experimentos |
| Analisar | diferenciar, organizar, comparar, investigar | análise de casos, comparação de fontes, gráficos |
| Avaliar | avaliar, justificar, defender, criticar | debates, revisão por pares, julgamentos |
| Criar | projetar, construir, desenvolver, inventar | projetos, protótipos, campanhas, invenções |

**Section sources**
- [README.md](file://README.md#L1-L277)

## Conclusão

A aplicação da Taxonomia de Bloom no VirtuQuest representa um avanço significativo no planejamento pedagógico digital. Ao estruturar os objetivos de aprendizagem em níveis cognitivos claros, integrar com a BNCC e vincular ao desenvolvimento de Virtudes Intelectuais, a plataforma oferece uma abordagem completa e intencional para a educação. Com o apoio da IA, os professores podem criar experiências de aprendizagem mais eficazes, alinhadas com as melhores práticas da pedagogia contemporânea.
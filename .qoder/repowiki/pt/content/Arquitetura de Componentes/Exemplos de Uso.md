# Exemplos de Uso

<cite>
**Arquivos Referenciados neste Documento**   
- [button.tsx](file://src/components/ui/button.tsx)
- [page.tsx](file://src/app/page.tsx)
- [educational.tsx](file://src/components/icons/educational.tsx)
- [utils.ts](file://src/lib/utils.ts)
- [tailwind.config.ts](file://tailwind.config.ts)
</cite>

## Sumário

1. [Introdução](#introdução)
2. [Componente Button: Variantes e Tamanhos](#componente-button-variantes-e-tamanhos)
3. [Cenários Pedagógicos com Botões](#cenários-pedagógicos-com-botões)
4. [Uso com Ícones Lucide](#uso-com-ícones-lucide)
5. [Integração com Next.js Link (asChild)](#integração-com-nextjs-link-aschild)
6. [Composição de Componentes na Página Inicial](#composição-de-componentes-na-página-inicial)
7. [Recomendações de Acessibilidade](#recomendações-de-acessibilidade)
8. [Padrões Replicáveis em Novas Páginas](#padrões-replicáveis-em-novas-páginas)

## Introdução

Este documento apresenta exemplos práticos e reais de uso dos componentes da
aplicação VirtuQuest, com foco no componente `Button` e sua integração em
cenários pedagógicos. São demonstradas todas as variantes e tamanhos
disponíveis, uso com ícones Lucide, integração com Next.js Link via prop
`asChild`, e padrões de composição de componentes na interface. O objetivo é
fornecer orientações claras para replicar esses padrões em novas páginas do
sistema.

## Componente Button: Variantes e Tamanhos

O componente `Button` é implementado utilizando `class-variance-authority` (cva)
para gerenciar variantes de estilo e tamanho. As variantes definidas incluem:
`default`, `destructive`, `outline`, `secondary`, `ghost` e `link`. Os tamanhos
disponíveis são: `default`, `sm`, `lg` e `icon`.

As classes de cada variante são mapeadas para o sistema de design baseado em
variáveis CSS, garantindo consistência com o tema da aplicação. O componente
também suporta a propriedade `asChild`, que permite substituir a tag `button`
por qualquer outro componente, útil para integração com componentes de
roteamento como o `Link` do Next.js.

**Seção fontes**

- [button.tsx](file://src/components/ui/button.tsx#L10-L26)
- [button.tsx](file://src/components/ui/button.tsx#L21-L26)

## Cenários Pedagógicos com Botões

### Criar Plano

Botão para iniciar o processo de criação de um novo plano de aula, utilizando a
variante padrão com ícone.

```mermaid
flowchart TD
A["Botão 'Criar Plano'"] --> B["Variante: default"]
A --> C["Tamanho: default"]
A --> D["Ícone: BookOpen"]
A --> E["Ação: Navega para /plano/novo"]
```

**Fontes do Diagrama**

- [button.tsx](file://src/components/ui/button.tsx#L10-L10)
- [educational.tsx](file://src/components/icons/educational.tsx#L15-L15)

### Excluir Avaliação

Botão para exclusão de uma avaliação, utilizando a variante destrutiva para
indicar ação crítica.

```mermaid
flowchart TD
A["Botão 'Excluir Avaliação'"] --> B["Variante: destructive"]
A --> C["Tamanho: default"]
A --> D["Ícone: XCircle"]
A --> E["Ação: Abre diálogo de confirmação"]
```

**Fontes do Diagrama**

- [button.tsx](file://src/components/ui/button.tsx#L11-L11)
- [educational.tsx](file://src/components/icons/educational.tsx#L28-L28)

### Visualizar Insights

Botão para visualização de insights pedagógicos, utilizando a variante
secundária para ação secundária.

```mermaid
flowchart TD
A["Botão 'Visualizar Insights'"] --> B["Variante: secondary"]
A --> C["Tamanho: default"]
A --> D["Ícone: TrendingUp"]
A --> E["Ação: Navega para /insights"]
```

**Fontes do Diagrama**

- [button.tsx](file://src/components/ui/button.tsx#L13-L13)
- [educational.tsx](file://src/components/icons/educational.tsx#L34-L34)

## Uso com Ícones Lucide

O sistema utiliza a biblioteca `lucide-react` para ícones, com mapeamento
semântico para o contexto educacional em `educational.tsx`. Os ícones são
integrados ao componente `Button` usando composição.

### Mapeamento de Ícones Educacionais

Os ícones são organizados em categorias temáticas:

```mermaid
erDiagram
BNCC ||--o{ ICON : "tem"
BLOOM ||--o{ ICON : "tem"
VIRTUDE ||--o{ ICON : "tem"
STATUS ||--o{ ICON : "tem"
BNCC {
string competencia
string habilidade
string objetoConhecimento
}
BLOOM {
string lembrar
string entender
string aplicar
string analisar
string avaliar
string criar
}
VIRTUDE {
string curiosidade
string humildade
string coragem
string autonomia
string perseveranca
string honestidade
}
STATUS {
string RASCUNHO
string EM_REVISAO
string PENDENTE_APROVACAO
string APROVADO
string BLOQUEADO
string PUBLICADO
}
ICON {
string nome
string componente
}
```

**Fontes do Diagrama**

- [educational.tsx](file://src/components/icons/educational.tsx#L15-L180)

## Integração com Next.js Link (asChild)

A propriedade `asChild` permite que o componente `Button` renderize qualquer
componente filho, mantendo o estilo do botão. Isso é especialmente útil para
integração com o componente `Link` do Next.js, permitindo navegação sem
recarregar a página.

```mermaid
flowchart TD
A["Componente Button"] --> B{"asChild?"}
B --> |true| C["Renderiza Slot"]
B --> |false| D["Renderiza button"]
C --> E["Slot recebe qualquer componente"]
E --> F["Ex: Link do Next.js"]
F --> G["Navegação suave"]
```

**Fontes do Diagrama**

- [button.tsx](file://src/components/ui/button.tsx#L41-L52)
- [button.tsx](file://src/components/ui/button.tsx#L38-L38)

## Composição de Componentes na Página Inicial

A página inicial demonstra o uso de grids responsivos, classes de espaçamento e
cores temáticas para criar uma interface coesa.

### Estrutura de Grid Responsivo

O layout utiliza o sistema de grid do Tailwind CSS com breakpoints responsivos.

```mermaid
graph TD
A["Container Principal"] --> B["Grid"]
B --> C["1 coluna (mobile)"]
B --> D["2 colunas (md+)"]
C --> E["Card de Recurso"]
D --> F["Card de Recurso"]
style A fill:#f9f,stroke:#333
style B fill:#bbf,stroke:#333
style C fill:#f96,stroke:#333
style D fill:#f96,stroke:#333
```

**Fontes do Diagrama**

- [page.tsx](file://src/app/page.tsx#L20-L21)
- [tailwind.config.ts](file://tailwind.config.ts#L3-L7)

### Classes de Espaçamento Temáticas

O sistema define espaçamentos temáticos em `tailwind.config.ts` para
consistência visual.

```mermaid
classDiagram
class Spacing {
+xs : 0.5rem
+sm : 1rem
+md : 1.5rem
+lg : 2rem
+xl : 3rem
+2xl : 4rem
}
class Margin {
+m-xs : spacing-xs
+m-sm : spacing-sm
+mt-md : spacing-md
+mb-lg : spacing-lg
}
class Padding {
+p-md : spacing-md
+py-lg : spacing-lg
+px-xl : spacing-xl
}
Margin --> Spacing : "usa"
Padding --> Spacing : "usa"
```

**Fontes do Diagrama**

- [tailwind.config.ts](file://tailwind.config.ts#L70-L76)
- [page.tsx](file://src/app/page.tsx#L15-L16)

## Recomendações de Acessibilidade

### Atributos ARIA

Sempre inclua atributos ARIA apropriados para botões com ícones:

```mermaid
flowchart TD
A["Botão com Ícone"] --> B{"Texto visível?"}
B --> |Sim| C["Não precisa de aria-label"]
B --> |Não| D["Adicionar aria-label"]
D --> E["Ex: aria-label='Criar novo plano'"]
C --> F["Acessível"]
E --> G["Acessível"]
```

**Fontes do Diagrama**

- [button.tsx](file://src/components/ui/button.tsx#L35-L39)

### Contraste de Cores

As variantes de botão seguem as diretrizes de contraste WCAG:

- **Texto primário**: contraste mínimo 4.5:1 com fundo
- **Estado hover**: feedback visual claro sem depender apenas de cor
- **Estado disabled**: opacidade reduzida para indicar inatividade

O sistema de cores utiliza variáveis CSS definidas em `tailwind.config.ts`,
garantindo consistência entre temas claro e escuro.

**Seção fontes**

- [tailwind.config.ts](file://tailwind.config.ts#L15-L68)

## Padrões Replicáveis em Novas Páginas

### Estrutura de Página Recomendada

Padrão para criar novas páginas no sistema:

```mermaid
flowchart TD
A["Layout com ThemeProvider"] --> B["Container com max-width"]
B --> C["Header com título e descrição"]
C --> D["Grid responsivo"]
D --> E["Cards ou componentes de conteúdo"]
E --> F["Botões de ação com variantes apropriadas"]
F --> G["Ícones semânticos do educational.tsx"]
G --> H["Classes de espaçamento temáticas"]
```

**Fontes do Diagrama**

- [layout.tsx](file://src/app/layout.tsx#L35-L39)
- [page.tsx](file://src/app/page.tsx#L10-L84)

### Boas Práticas de Implementação

1. **Use variantes de botão apropriadas para o contexto**
2. **Sempre inclua feedback visual para estados de interação**
3. **Utilize o sistema de espaçamento temático em vez de valores fixos**
4. **Prefira ícones semânticos de `educational.tsx` ao invés de ícones
   genéricos**
5. **Garanta acessibilidade com atributos ARIA e bom contraste**

**Seção fontes**

- [button.tsx](file://src/components/ui/button.tsx)
- [educational.tsx](file://src/components/icons/educational.tsx)
- [tailwind.config.ts](file://tailwind.config.ts)
- [page.tsx](file://src/app/page.tsx)
- [utils.ts](file://src/lib/utils.ts)

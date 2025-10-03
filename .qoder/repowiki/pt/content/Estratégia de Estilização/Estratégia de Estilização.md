# Estratégia de Estilização

<cite>
**Arquivos Referenciados neste Documento**  
- [tailwind.config.ts](file://tailwind.config.ts)
- [src/styles/globals.css](file://src/styles/globals.css)
- [src/styles/design-tokens.css](file://src/styles/design-tokens.css)
- [src/providers/theme-provider.tsx](file://src/providers/theme-provider.tsx)
- [src/components/ui/button.tsx](file://src/components/ui/button.tsx)
- [src/types/theme.ts](file://src/types/theme.ts)
</cite>

## Sumário

1. [Introdução](#introdução)
2. [Configuração do Tailwind CSS](#configuração-do-tailwind-css)
3. [Sistema de Cores Educacional](#sistema-de-cores-educacional)
4. [Modo Escuro e Variáveis CSS](#modo-escuro-e-variáveis-css)
5. [Organização de Classes Utilitárias](#organização-de-classes-utilitárias)
6. [Implementação de Componentes Estilizados](#implementação-de-componentes-estilizados)
7. [Boas Práticas de Estilização](#boas-práticas-de-estilização)
8. [Integração com Componentes UI](#integração-com-componentes-ui)
9. [Conclusão](#conclusão)

## Introdução

A estratégia de estilização do VirtuQuest é baseada no Tailwind CSS 4, com um
sistema de design robusto que integra princípios pedagógicos e acessibilidade. O
sistema utiliza variáveis CSS para gerenciar temas, modos claro/escuro, esquemas
de cores alternativos e tamanhos de fonte, permitindo uma personalização
completa da interface. A arquitetura de estilização foi projetada para suportar
o contexto educacional do sistema, com cores semânticas alinhadas à BNCC,
Taxonomia de Bloom e Virtudes Intelectuais.

## Configuração do Tailwind CSS

A configuração do Tailwind CSS é definida no arquivo `tailwind.config.ts`, que
estabelece as bases do sistema de design do VirtuQuest.

**Section sources**

- [tailwind.config.ts](file://tailwind.config.ts#L1-L105)

### Temas e Cores

O sistema de cores é baseado em variáveis CSS que permitem a troca dinâmica de
temas. As cores são organizadas em categorias semânticas que seguem o padrão
shadcn/ui, com extensões específicas para o contexto educacional.

```mermaid
classDiagram
class ThemeColors {
+background : hsl(var(--background))
+foreground : hsl(var(--foreground))
+primary : hsl(var(--primary))
+secondary : hsl(var(--secondary))
+muted : hsl(var(--muted))
+accent : hsl(var(--accent))
+destructive : hsl(var(--destructive))
+border : hsl(var(--border))
+input : hsl(var(--input))
+ring : hsl(var(--ring))
}
class EducationalColors {
+bncc_competencia : hsl(var(--bncc-competencia))
+bncc_habilidade : hsl(var(--bncc-habilidade))
+bloom_lembrar : hsl(var(--bloom-lembrar))
+bloom_entender : hsl(var(--bloom-entender))
+bloom_aplicar : hsl(var(--bloom-aplicar))
+bloom_analisar : hsl(var(--bloom-analisar))
+bloom_avaliar : hsl(var(--bloom-avaliar))
+bloom_criar : hsl(var(--bloom-criar))
+virtude_curiosidade : hsl(var(--virtude-curiosidade))
+virtude_humildade : hsl(var(--virtude-humildade))
+virtude_coragem : hsl(var(--virtude-coragem))
+virtude_autonomia : hsl(var(--virtude-autonomia))
}
ThemeColors <|-- EducationalColors : "extends"
```

**Diagram sources**

- [tailwind.config.ts](file://tailwind.config.ts#L47-L86)
- [src/styles/design-tokens.css](file://src/styles/design-tokens.css#L36-L84)

### Breakpoints e Responsividade

O sistema de breakpoints é configurado para suportar dispositivos móveis,
tablets e desktops, garantindo uma experiência responsiva em todos os
dispositivos.

```mermaid
flowchart TD
A["Breakpoints"] --> B["sm: 640px"]
A --> C["md: 768px"]
A --> D["lg: 1024px"]
A --> E["xl: 1280px"]
A --> F["2xl: 1536px"]
G["Layouts"] --> H["Mobile: Coluna única"]
G --> I["Tablet: Grid 2 colunas"]
G --> J["Desktop: Grid 3-4 colunas"]
G --> K["Large Desktop: Grid avançado"]
```

**Diagram sources**

- [tailwind.config.ts](file://tailwind.config.ts#L1-L105)
- [src/types/theme.ts](file://src/types/theme.ts#L93-L144)

### Plugins e Extensões

O sistema não utiliza plugins externos no momento, mantendo uma configuração
limpa e focada nas funcionalidades nativas do Tailwind CSS. Isso garante maior
controle sobre o sistema de estilos e evita dependências desnecessárias.

## Sistema de Cores Educacional

O sistema de cores do VirtuQuest é projetado especificamente para o contexto
educacional, com paletas que representam conceitos pedagógicos importantes.

### Cores BNCC

As cores da BNCC são usadas para representar competências e habilidades
curriculares, facilitando a identificação visual de conteúdos alinhados à Base
Nacional Comum Curricular.

**Section sources**

- [tailwind.config.ts](file://tailwind.config.ts#L47-L52)
- [src/styles/design-tokens.css](file://src/styles/design-tokens.css#L36-L40)

### Taxonomia de Bloom

Cada nível da Taxonomia de Bloom possui uma cor específica, criando uma escala
visual que representa a progressão do pensamento cognitivo, desde o simples ato
de lembrar até a criação de novos conhecimentos.

```mermaid
flowchart LR
A["Lembrar"] --> |Laranja| B["Entender"]
B --> |Amarelo| C["Aplicar"]
C --> |Verde| D["Analisar"]
D --> |Azul| E["Avaliar"]
E --> |Roxo| F["Criar"]
style A fill:#f97316,stroke:#f97316,color:white
style B fill:#facc15,stroke:#facc15,color:black
style C fill:#22c55e,stroke:#22c55e,color:white
style D fill:#06b6d4,stroke:#06b6d4,color:white
style E fill:#8b5cf6,stroke:#8b5cf6,color:white
style F fill:#ec4899,stroke:#ec4899,color:white
```

**Diagram sources**

- [tailwind.config.ts](file://tailwind.config.ts#L53-L64)
- [src/styles/design-tokens.css](file://src/styles/design-tokens.css#L41-L46)

### Virtudes Intelectuais

As virtudes intelectuais possuem cores que representam seus valores, ajudando a
reforçar conceitos de caráter e pensamento crítico na interface do usuário.

**Section sources**

- [tailwind.config.ts](file://tailwind.config.ts#L65-L70)
- [src/styles/design-tokens.css](file://src/styles/design-tokens.css#L47-L52)

## Modo Escuro e Variáveis CSS

O sistema de temas do VirtuQuest é baseado em variáveis CSS, permitindo uma
transição suave entre modos claro e escuro, além de suportar esquemas de cores
alternativos.

### Estrutura de Variáveis

As variáveis CSS são definidas no arquivo `design-tokens.css`, que contém todos
os tokens de design do sistema.

```mermaid
classDiagram
class DesignTokens {
+--background
+--foreground
+--primary
+--secondary
+--muted
+--accent
+--destructive
+--border
+--input
+--ring
+--radius
+--spacing-xs
+--spacing-sm
+--spacing-md
+--spacing-lg
+--spacing-xl
+--spacing-2xl
+--font-sans
+--font-mono
+--font-educational
+--text-xs
+--text-sm
+--text-base
+--text-lg
+--text-xl
+--text-2xl
+--text-3xl
+--shadow-sm
+--shadow-md
+--shadow-lg
+--shadow-xl
+--shadow-educational
+--animation-fast
+--animation-base
+--animation-slow
+--animation-slower
}
class ThemeVariants {
+ : root
+.dark
+[data-color-scheme='high-contrast']
+[data-color-scheme='daltonism']
+[data-font-size='large']
+[data-font-size='extra-large']
}
DesignTokens <|-- ThemeVariants : "defines"
```

**Diagram sources**

- [src/styles/design-tokens.css](file://src/styles/design-tokens.css#L1-L220)

### Implementação do ThemeProvider

O `ThemeProvider` gerencia o estado do tema, esquema de cores e tamanho da
fonte, persistindo as preferências do usuário no localStorage.

```mermaid
sequenceDiagram
participant User as "Usuário"
participant ThemeProvider as "ThemeProvider"
participant DOM as "DOM"
participant Storage as "LocalStorage"
User->>ThemeProvider : Seleciona tema (light/dark/system)
User->>ThemeProvider : Seleciona esquema de cores
User->>ThemeProvider : Ajusta tamanho da fonte
ThemeProvider->>Storage : Salva preferências
Storage-->>ThemeProvider : Confirmação
ThemeProvider->>DOM : Aplica classes e atributos
DOM-->>User : Interface atualizada
ThemeProvider->>DOM : Adiciona listener de sistema
DOM->>ThemeProvider : Notifica mudança de preferência
ThemeProvider->>DOM : Atualiza tema automaticamente
```

**Diagram sources**

- [src/providers/theme-provider.tsx](file://src/providers/theme-provider.tsx#L34-L156)
- [src/types/theme.ts](file://src/types/theme.ts#L1-L42)

**Section sources**

- [src/providers/theme-provider.tsx](file://src/providers/theme-provider.tsx#L1-L198)
- [src/types/theme.ts](file://src/types/theme.ts#L1-L144)

## Organização de Classes Utilitárias

O sistema utiliza uma organização clara das camadas do Tailwind CSS para manter
a separação de responsabilidades.

### Camadas do Tailwind

```mermaid
graph TD
A["@layer base"] --> B["Estilos base do sistema"]
A --> C["* { @apply border-border; }"]
A --> D["body { @apply bg-background text-foreground; }"]
A --> E["*:focus-visible { @apply ring-2 ring-ring; }"]
F["@layer components"] --> G["Componentes educacionais"]
F --> H["Estilos de componentes reutilizáveis"]
I["@layer utilities"] --> J["Classes utilitárias educacionais"]
I --> K["Classes de utilidade específica"]
```

**Diagram sources**

- [src/styles/globals.css](file://src/styles/globals.css#L1-L33)

### Uso de @apply

O `@apply` é utilizado para criar classes reutilizáveis e manter a consistência
visual, especialmente em componentes personalizados.

**Section sources**

- [src/styles/globals.css](file://src/styles/globals.css#L1-L33)
- [src/components/ui/button.tsx](file://src/components/ui/button.tsx#L6-L30)

## Implementação de Componentes Estilizados

A implementação de novos componentes deve seguir padrões consistentes para
garantir a integridade do design system.

### Exemplo de Componente Educacional

Para implementar um novo componente educacional, siga estas etapas:

1. Crie o componente no diretório `src/components/educational/`
2. Utilize as variáveis CSS para cores e espaçamentos
3. Aplique classes do Tailwind respeitando o sistema de design
4. Garanta suporte a todos os temas e esquemas de cores

```mermaid
flowchart TD
A["Criar Componente"] --> B["Usar variáveis CSS"]
B --> C["Aplicar classes Tailwind"]
C --> D["Testar em todos os temas"]
D --> E["Verificar acessibilidade"]
E --> F["Documentar uso"]
```

**Section sources**

- [src/components/ui/button.tsx](file://src/components/ui/button.tsx#L38-L45)
- [src/types/theme.ts](file://src/types/theme.ts#L93-L144)

## Boas Práticas de Estilização

### Consistência Visual

Mantenha a consistência visual utilizando os tokens de design definidos no
sistema. Evite cores hard-coded e sempre utilize as variáveis CSS.

### Acessibilidade de Cores

O sistema inclui esquemas de cores alternativos para usuários com deficiências
visuais, como o esquema de alto contraste e o esquema para daltonismo.

```mermaid
graph LR
A["Esquemas de Cores"] --> B["Padrão"]
A --> C["Alto Contraste"]
A --> D["Daltonismo"]
B --> E["Cores balanceadas"]
C --> F["Contraste máximo"]
D --> G["Cores distinguíveis"]
```

**Diagram sources**

- [src/styles/design-tokens.css](file://src/styles/design-tokens.css#L134-L218)

### Responsividade

Todos os componentes devem ser responsivos, adaptando-se a diferentes tamanhos
de tela e orientações.

**Section sources**

- [tailwind.config.ts](file://tailwind.config.ts#L1-L105)
- [src/types/theme.ts](file://src/types/theme.ts#L93-L144)

## Integração com Componentes UI

Os componentes UI do sistema são construídos com base no shadcn/ui, estendendo
seus estilos para integrar-se ao design system educacional.

### Componente Button

O componente Button é um exemplo de como os componentes UI são estilizados com
base no sistema de design.

```mermaid
classDiagram
class ButtonVariants {
+variant : default|destructive|outline|secondary|ghost|link
+size : default|sm|lg|icon
+defaultVariants : {variant : 'default', size : 'default'}
}
class ButtonClasses {
+base : "inline-flex items-center justify-center..."
+variant_default : "bg-primary text-primary-foreground hover : bg-primary/90"
+variant_destructive : "bg-destructive text-destructive-foreground hover : bg-destructive/90"
+variant_outline : "border border-input bg-background hover : bg-accent hover : text-accent-foreground"
+variant_secondary : "bg-secondary text-secondary-foreground hover : bg-secondary/80"
+variant_ghost : "hover : bg-accent hover : text-accent-foreground"
+variant_link : "text-primary underline-offset-4 hover : underline"
+size_default : "h-10 px-4 py-2"
+size_sm : "h-9 rounded-md px-3"
+size_lg : "h-11 rounded-md px-8"
+size_icon : "h-10 w-10"
}
ButtonVariants --> ButtonClasses : "defines"
```

**Diagram sources**

- [src/components/ui/button.tsx](file://src/components/ui/button.tsx#L6-L30)

**Section sources**

- [src/components/ui/button.tsx](file://src/components/ui/button.tsx#L1-L45)

## Conclusão

A estratégia de estilização do VirtuQuest combina a flexibilidade do Tailwind
CSS com um sistema de design educacional robusto, criando uma experiência visual
coesa e pedagogicamente significativa. O uso de variáveis CSS permite uma
personalização completa da interface, enquanto o sistema de cores educacional
reforça conceitos importantes para os usuários do sistema. A integração com o
ThemeProvider garante que as preferências do usuário sejam persistentes e
aplicadas consistentemente em toda a aplicação.

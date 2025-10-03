# Design System VirtuQuest

## Visão Geral

O VirtuQuest Design System é um sistema de design educacional baseado em
**shadcn/ui** e **Tailwind CSS**, especialmente projetado para aplicações
pedagógicas que integram BNCC, Taxonomia de Bloom e Virtudes Intelectuais.

## Características Principais

- ✅ **Componentes shadcn/ui oficiais** - Base sólida e acessível
- ✅ **Design Tokens semânticos** - Sistema completo de variáveis CSS
- ✅ **Tematização avançada** - Suporte a light/dark/system themes
- ✅ **Acessibilidade** - Esquemas de alto contraste e daltonismo
- ✅ **Responsividade** - Mobile-first approach
- ✅ **Contexto educacional** - Cores e componentes específicos para
  BNCC/Bloom/Virtudes

## Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/                     # Componentes shadcn/ui base
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── spinner.tsx
│   │   ├── rating.tsx
│   │   └── index.ts
│   ├── educational/            # Componentes educacionais especializados
│   │   ├── bncc-badge.tsx
│   │   ├── bloom-indicator.tsx
│   │   ├── status-pill.tsx
│   │   └── plano-aula-card.tsx
│   └── icons/
│       └── educational.tsx     # Ícones educacionais
├── providers/
│   └── theme-provider.tsx      # Provider de tema com persistência
├── hooks/
│   ├── use-media-query.ts      # Hook para media queries
│   └── use-breakpoint.ts       # Hook para breakpoints responsivos
├── styles/
│   ├── design-tokens.css       # Tokens de design completos
│   └── globals.css             # Estilos globais
└── types/
    └── theme.ts                # Tipos TypeScript para tema
```

## Design Tokens

### Cores Base

```css
:root {
  /* Cores Semânticas */
  --primary: 217 91% 60%; /* Azul institucional */
  --secondary: 142 76% 36%; /* Verde educacional */
  --success: 142 71% 45%; /* Verde de sucesso */
  --warning: 38 92% 50%; /* Amarelo de alerta */
  --destructive: 0 72% 51%; /* Vermelho de erro */

  /* BNCC */
  --bncc-competencia: 271 91% 65%; /* Roxo para competências */
  --bncc-habilidade: 199 89% 48%; /* Azul para habilidades */

  /* Taxonomia de Bloom */
  --bloom-lembrar: 39 100% 50%; /* Laranja */
  --bloom-compreender: 45 100% 51%; /* Amarelo */
  --bloom-aplicar: 142 71% 45%; /* Verde */
  --bloom-analisar: 199 89% 48%; /* Azul */
  --bloom-avaliar: 271 76% 53%; /* Roxo */
  --bloom-criar: 333 71% 51%; /* Rosa */

  /* Virtudes Intelectuais */
  --virtude-curiosidade: 199 95% 74%;
  --virtude-humildade: 142 43% 39%;
  --virtude-coragem: 25 95% 53%;
  --virtude-autonomia: 262 83% 58%;
}
```

### Espacamento

```css
:root {
  --spacing-xs: 0.25rem; /* 4px */
  --spacing-sm: 0.5rem; /* 8px */
  --spacing-md: 1rem; /* 16px */
  --spacing-lg: 1.5rem; /* 24px */
  --spacing-xl: 2rem; /* 32px */
  --spacing-2xl: 3rem; /* 48px */
}
```

### Tipografia

```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-educational: 'Lexend', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
}
```

## Componentes Educacionais

### BNCCBadge

Badge para exibir competências e habilidades da BNCC:

```tsx
import { BNCCBadge } from '@/components/educational/bncc-badge';

<BNCCBadge competencia="COMP01" />
<BNCCBadge habilidade="EF09MA20" />
<BNCCBadge competencia="COMP05" habilidade="EF67LP28" />
```

### BloomIndicator

Indicador dos níveis da Taxonomia de Bloom:

```tsx
import { BloomIndicator } from '@/components/educational/bloom-indicator';

<BloomIndicator nivel="LEMBRAR" />
<BloomIndicator nivel="APLICAR" variant="compact" />
<BloomIndicator nivel="CRIAR" showLabel={true} />
```

### StatusPill

Pills para status de planos de aula:

```tsx
import { StatusPill } from '@/components/educational/status-pill';

<StatusPill status="RASCUNHO" />
<StatusPill status="APROVADO" size="sm" />
<StatusPill status="PUBLICADO" showIcon={true} />
```

### PlanoAulaCard

Card completo para exibir planos de aula:

```tsx
import { PlanoAulaCard } from '@/components/educational/plano-aula-card';

<PlanoAulaCard
  plano={planoData}
  variant="default"
  onEdit={(id) => console.log('Edit:', id)}
  onView={(id) => console.log('View:', id)}
/>;
```

## Gerenciamento de Tema

### ThemeProvider

O `ThemeProvider` gerencia tema, esquema de cores e tamanho de fonte:

```tsx
import { ThemeProvider } from '@/providers/theme-provider';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Hook useTheme

```tsx
import { useTheme } from '@/providers/theme-provider';

function ThemeToggle() {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme('dark')}>Modo Escuro</button>
      <button onClick={() => setColorScheme('high-contrast')}>
        Alto Contraste
      </button>
    </div>
  );
}
```

## Hooks de Responsividade

### useMediaQuery

```tsx
import { useMediaQuery } from '@/hooks/use-media-query';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)'
  );

  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
}
```

### useBreakpoint

```tsx
import { useBreakpoint } from '@/hooks/use-breakpoint';

function BreakpointAware() {
  const { isMobile, isDesktop, breakpoint, isAbove } = useBreakpoint();

  return (
    <div>
      <p>Breakpoint atual: {breakpoint}</p>
      {isAbove('md') && <TabletFeature />}
      {isDesktop && <DesktopFeature />}
    </div>
  );
}
```

## Temas e Acessibilidade

### Esquemas de Cores

- **default**: Cores padrão do sistema
- **high-contrast**: Alto contraste para melhor visibilidade
- **daltonism**: Adaptado para daltonismo (azuis e amarelos)

### Tamanhos de Fonte

- **normal**: Tamanhos padrão
- **large**: 125% do tamanho padrão
- **extra-large**: 150% do tamanho padrão

### Aplicação

```tsx
// Via JavaScript
const { setColorScheme, setFontSize } = useTheme();
setColorScheme('high-contrast');
setFontSize('large');

// Via CSS (aplicado automaticamente)
[data-color-scheme='high-contrast'] { /* estilos */ }
[data-font-size='large'] { /* estilos */ }
```

## Exemplos de Uso

### Formulário Educacional

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui';
import { BNCCBadge, BloomIndicator } from '@/components/educational';

function PlanoAulaForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Plano de Aula</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Título do plano" />
        <Textarea placeholder="Descrição" />

        <div className="flex gap-2">
          <BNCCBadge competencia="COMP01" />
          <BloomIndicator nivel="APLICAR" variant="compact" />
        </div>
      </CardContent>
    </Card>
  );
}
```

### Dashboard Responsivo

```tsx
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { PlanoAulaCard } from '@/components/educational';

function Dashboard() {
  const { isMobile, isTablet } = useBreakpoint();

  const gridCols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div className={`grid grid-cols-${gridCols} gap-4`}>
      {planos.map((plano) => (
        <PlanoAulaCard
          key={plano.id}
          plano={plano}
          variant={isMobile ? 'compact' : 'default'}
        />
      ))}
    </div>
  );
}
```

## Boas Práticas

### 1. Use os Design Tokens

```tsx
// ✅ Correto - usando tokens
const style = { color: 'hsl(var(--primary))' };

// ❌ Incorreto - valor hardcoded
const style = { color: '#3b82f6' };
```

### 2. Responsividade Mobile-First

```tsx
// ✅ Correto - mobile first
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ Incorreto - desktop first
<div className="w-1/3 lg:w-1/2 md:w-full">
```

### 3. Acessibilidade

```tsx
// ✅ Correto - com labels e aria
<Input
  aria-label="Título do plano"
  placeholder="Digite o título"
/>

// ❌ Incorreto - sem contexto
<Input placeholder="Digite aqui" />
```

### 4. Componentes Educacionais

```tsx
// ✅ Correto - usando componentes especializados
<BNCCBadge competencia="COMP01" />

// ❌ Incorreto - implementação manual
<Badge className="bg-purple-500">COMP01</Badge>
```

## Próximos Passos

1. **Expandir componentes shadcn/ui**: Adicionar mais componentes conforme
   necessário
2. **Melhorar acessibilidade**: Implementar mais recursos de acessibilidade
3. **Testes**: Implementar testes automatizados para componentes
4. **Storybook**: Documentação visual interativa
5. **Performance**: Otimizações de bundle e runtime

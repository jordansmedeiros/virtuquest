# Instalação shadcn/ui - VirtuQuest

## Guia de Instalação dos Componentes shadcn/ui Oficiais

Este documento contém todos os comandos de instalação para os componentes
shadcn/ui utilizados no VirtuQuest Design System.

## Pré-requisitos

Certifique-se de que o projeto já possui:

```bash
# Dependências já instaladas
npm install @radix-ui/react-tabs @radix-ui/react-dialog @radix-ui/react-select
npm install @radix-ui/react-popover @radix-ui/react-use-controllable-state
npm install cmdk lucide-react
```

## Componentes Atualmente Implementados

### ✅ Já Instalados Manualmente

Os seguintes componentes foram implementados manualmente com base nas
especificações oficiais:

- **Badge** (`src/components/ui/badge.tsx`)
- **Button** (`src/components/ui/button.tsx`)
- **Card** (`src/components/ui/card.tsx`)
- **Label** (`src/components/ui/label.tsx`)
- **Separator** (`src/components/ui/separator.tsx`)
- **Input** (`src/components/ui/input.tsx`)
- **Textarea** (`src/components/ui/textarea.tsx`)
- **Select** (`src/components/ui/select.tsx`)
- **Tabs** (`src/components/ui/tabs.tsx`)
- **Table** (`src/components/ui/table.tsx`)
- **Dialog** (`src/components/ui/dialog.tsx`)
- **Popover** (`src/components/ui/popover.tsx`)
- **Command** (`src/components/ui/command.tsx`)
- **Spinner** (`src/components/ui/spinner.tsx`)
- **Rating** (`src/components/ui/rating.tsx`)

## Instalação via CLI shadcn/ui

Para usar a CLI oficial do shadcn/ui (recomendado para novos componentes):

### 1. Inicialização (se necessário)

```bash
npx shadcn@latest init
```

**Configuração recomendada:**

- TypeScript: Yes
- Style: CSS variables
- Color: Neutral
- Global CSS: src/styles/globals.css
- CSS variables: Yes
- Tailwind config: tailwind.config.ts
- Import alias: @/\*
- React Server Components: Yes

### 2. Componentes Adicionais Recomendados

Para expandir o Design System, instale estes componentes conforme necessário:

#### Componentes de Formulário

```bash
npx shadcn@latest add form
npx shadcn@latest add checkbox
npx shadcn@latest add switch
npx shadcn@latest add radio-group
npx shadcn@latest add slider
```

#### Componentes de Navegação

```bash
npx shadcn@latest add dropdown-menu
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
npx shadcn@latest add pagination
```

#### Componentes de Layout

```bash
npx shadcn@latest add sheet
npx shadcn@latest add accordion
npx shadcn@latest add collapsible
npx shadcn@latest add resizable
```

#### Componentes de Feedback

```bash
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add progress
npx shadcn@latest add skeleton
npx shadcn@latest add tooltip
npx shadcn@latest add alert-dialog
```

#### Componentes de Data

```bash
npx shadcn@latest add calendar
npx shadcn@latest add date-picker
npx shadcn@latest add data-table
```

#### Componentes Avançados

```bash
npx shadcn@latest add context-menu
npx shadcn@latest add menubar
npx shadcn@latest add scroll-area
npx shadcn@latest add toggle
npx shadcn@latest add toggle-group
npx shadcn@latest add avatar
npx shadcn@latest add aspect-ratio
```

### 3. Instalação em Lote

Para instalar múltiplos componentes de uma vez:

```bash
# Componentes essenciais para educação
npx shadcn@latest add form checkbox switch calendar date-picker toast alert progress

# Componentes de navegação
npx shadcn@latest add dropdown-menu sheet accordion breadcrumb

# Componentes avançados
npx shadcn@latest add data-table context-menu scroll-area avatar
```

## Integração com Design Tokens

Após instalar novos componentes via CLI, certifique-se de:

### 1. Verificar Design Tokens

Os componentes devem usar automaticamente os tokens definidos em
`src/styles/design-tokens.css`.

### 2. Adicionar Exports

Adicione as exportações no arquivo `src/components/ui/index.ts`:

```typescript
// Novos componentes
export * from './toast';
export * from './alert';
export * from './progress';
export * from './form';
export * from './checkbox';
// ... outros componentes
```

### 3. Testar Tematização

Verifique se os novos componentes respondem corretamente aos temas:

```tsx
import { useTheme } from '@/providers/theme-provider';

function TestComponent() {
  const { setTheme, setColorScheme } = useTheme();

  return (
    <div className="space-y-4">
      <Button onClick={() => setTheme('dark')}>Modo Escuro</Button>
      <Button onClick={() => setColorScheme('high-contrast')}>
        Alto Contraste
      </Button>
      {/* Teste seus novos componentes aqui */}
    </div>
  );
}
```

## Customizações Específicas do VirtuQuest

### 1. Cores Educacionais

Para componentes que precisam usar cores educacionais específicas:

```tsx
// Badge BNCC customizado
<Badge className="bg-[hsl(var(--bncc-competencia))] text-white">
  COMP01
</Badge>

// Alert com cor Bloom
<Alert className="border-l-4 border-l-[hsl(var(--bloom-aplicar))]">
  <AlertDescription>Atividade de aplicação</AlertDescription>
</Alert>
```

### 2. Variantes Educacionais

Crie variantes específicas para o contexto educacional:

```tsx
// Extend existing components
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BNCCButton({ className, ...props }) {
  return (
    <Button
      className={cn(
        'bg-[hsl(var(--bncc-competencia))] hover:bg-[hsl(var(--bncc-competencia))]/90',
        className
      )}
      {...props}
    />
  );
}
```

## Resolução de Problemas

### Erro: "Package not found"

```bash
# Atualizar shadcn CLI
npm install -g @shadcn/ui@latest

# Ou usar npx para versão mais recente
npx shadcn@latest add component-name
```

### Erro: "Conflicting dependencies"

```bash
# Verificar dependências peer
npm ls @radix-ui/react-dialog
npm ls @radix-ui/react-popover

# Instalar dependências peer em falta
npm install @radix-ui/react-component-name
```

### Componente não aplica tema

Verifique se:

1. O componente está dentro do `<ThemeProvider>`
2. As classes CSS estão sendo aplicadas corretamente
3. Os design tokens estão importados em `globals.css`

```tsx
// Verificação de debug
<div className="bg-primary p-4 text-primary-foreground">Teste de tema</div>
```

## Monitoramento de Atualizações

Para manter os componentes atualizados:

```bash
# Verificar componentes disponíveis
npx shadcn@latest diff

# Atualizar componente específico
npx shadcn@latest add button --overwrite

# Verificar versão da CLI
npx shadcn@latest --version
```

## Próximos Passos

1. **Prioridade Alta**: Form, Toast, Alert, Progress
2. **Prioridade Média**: Calendar, Data Table, Dropdown Menu
3. **Prioridade Baixa**: Avatar, Context Menu, Menubar

Execute os comandos conforme a necessidade do desenvolvimento e sempre teste a
integração com o sistema de temas do VirtuQuest.

## Links Úteis

- [Documentação oficial shadcn/ui](https://ui.shadcn.com)
- [Componentes disponíveis](https://ui.shadcn.com/docs/components)
- [Guia de instalação](https://ui.shadcn.com/docs/installation)
- [Customização de temas](https://ui.shadcn.com/docs/theming)

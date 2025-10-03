# VirtuQuest

**Sistema de Planejamento Pedagógico Integrado BNCC-Bloom-Virtudes**

Uma plataforma educacional completa que integra competências e habilidades da
BNCC, processos cognitivos da Taxonomia de Bloom e desenvolvimento de Virtudes
Intelectuais, potencializada por assistência pedagógica com IA.

## 📚 Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Primeiros Passos](#primeiros-passos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Desenvolvimento](#desenvolvimento)
- [Scripts](#scripts)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Visão Geral

O VirtuQuest é uma plataforma inovadora que revoluciona o planejamento
pedagógico através da integração harmoniosa de:

- **BNCC (Base Nacional Comum Curricular)** - Competências e habilidades
  oficiais
- **Taxonomia de Bloom** - Processos cognitivos estruturados
- **Virtudes Intelectuais** - Desenvolvimento do caráter e pensamento crítico
- **Assistência com IA** - Sugestões pedagógicas inteligentes
- **Automação N8N** - Fluxos de trabalho otimizados

## ✨ Funcionalidades

- ✅ **Planejamento Integrado de Aulas** (BNCC + Bloom + Virtudes)
- ✅ **Sugestões de Conteúdo com IA**
- ✅ **Geração de Avaliações Multidimensionais**
- ✅ **Fluxo de Aprovação para Gestão Escolar**
- ✅ **Dashboard de Insights Pedagógicos**
- ✅ **Arquitetura Offline-first com Sincronização**
- ✅ **Controle de Acesso Baseado em Papéis (RBAC)**
- ✅ **Sistema de Gamificação**
- ✅ **Integrações Externas** (Khan Academy, Google Forms, SEDUC)

## 🛠 Stack Tecnológica

### Confirmadas (Estável - Outubro 2025)

- **Framework**: Next.js 15.5.4 (App Router)
- **Linguagem**: TypeScript 5.9.3 (modo strict)
- **Estilização**: Tailwind CSS 4.1.13 ⚠️ _ou 3.4.17 - aguardando confirmação_
- **Componentes UI**: shadcn/ui + Radix UI
- **Gerenciamento de Estado**: Zustand 5.0.8
- **Formulários**: React Hook Form 7.63.0 + Zod 4.1.11 ⚠️ _v4 vs v3 - aguardando
  confirmação_
- **Gráficos**: Recharts 3.2.1 ⚠️ _v3 vs v2 - aguardando confirmação_
- **Animações**: Framer Motion 12.23.12 ⚠️ _v12 vs v11 - aguardando confirmação_
- **Ícones**: Lucide React 0.544.0
- **Integração Backend**: Webhooks N8N
- **Gerenciador de Pacotes**: pnpm 9.x (recomendado)

### ⚠️ Aguardando Confirmação da Equipe

Consulte [`DEPENDENCY_VERSIONS.md`](./docs/development/DEPENDENCY_VERSIONS.md)
para detalhes sobre versões que requerem aprovação da equipe devido a mudanças
incompatíveis.

## 📋 Pré-requisitos

- Node.js >= 20.0.0
- pnpm >= 9.0.0 (ou npm/yarn)
- Instância N8N (para fluxos de trabalho backend)

## 🚀 Primeiros Passos

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd virtuquest
```

### 2. Confirme as versões das dependências

```bash
# Revise DEPENDENCY_VERSIONS.md e confirme as versões pendentes
# Atualize package.json com as versões decididas pela equipe
```

### 3. Instale as dependências

```bash
pnpm install
```

### 4. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local com sua configuração

# Gere segredos seguros:
openssl rand -base64 32  # Para JWT_SECRET
openssl rand -base64 32  # Para JWT_REFRESH_SECRET
openssl rand -base64 32  # Para N8N_WEBHOOK_SECRET
```

### 5. Inicialize os hooks do Git

```bash
pnpm prepare
```

### 6. Configure shadcn/ui

```bash
npx shadcn@latest init
# Quando solicitado, use as configurações do components.json existente

# Instale componentes essenciais:
npx shadcn@latest add button card dialog form input select table tabs toast badge tooltip command sheet skeleton
```

### 7. Execute o servidor de desenvolvimento

```bash
pnpm dev
```

### 8. Abra no navegador

Navegue para `http://localhost:3000`

## 📁 Estrutura do Projeto

```
virtuquest/
├── src/
│   ├── app/              # Páginas Next.js App Router
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes base shadcn/ui
│   │   ├── educational/ # Componentes educacionais
│   │   └── layouts/     # Componentes de layout
│   ├── core/            # Lógica de domínio
│   │   ├── domain/      # Modelos de domínio (BNCC, Bloom, etc.)
│   │   └── infrastructure/ # Integração N8N
│   ├── lib/             # Utilitários e helpers
│   ├── stores/          # Gerenciamento de estado Zustand
│   ├── styles/          # Estilos globais e tokens
│   ├── types/           # Definições de tipos TypeScript
│   └── assets/          # Assets estáticos
├── docs/                # Documentação
│   └── fundamentos/     # Fundamentos pedagógicos
├── public/              # Arquivos públicos estáticos
└── [arquivos de config] # Arquivos de configuração
```

## 💻 Desenvolvimento

### Diretrizes de Código

- **Estilo de Código**: ESLint + Prettier (formatação automática ao salvar)
- **Commits**: Conventional Commits (aplicado por Husky)
- **Segurança de Tipos**: TypeScript modo strict
- **Testes**: (Serão adicionados na Fase 4)

### Conventional Commits

Exemplos de commits válidos:

- `feat(planner): add BNCC selector component`
- `fix(auth): resolve JWT refresh token issue`
- `docs(readme): update installation instructions`
- `refactor(domain): extract Bloom taxonomy validation`

## 📜 Scripts

| Script            | Descrição                          |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Inicia servidor de desenvolvimento |
| `pnpm build`      | Build para produção                |
| `pnpm start`      | Inicia servidor de produção        |
| `pnpm lint`       | Executa ESLint                     |
| `pnpm lint:fix`   | Corrige problemas de linting       |
| `pnpm format`     | Formata código com Prettier        |
| `pnpm type-check` | Verifica tipos TypeScript          |

## 🔐 Variáveis de Ambiente

### Essenciais

- `N8N_BASE_URL`: URL da instância N8N
- `JWT_SECRET`: Segredo para assinatura JWT
- `NEXT_PUBLIC_APP_URL`: URL pública da aplicação

### Feature Flags

- `NEXT_PUBLIC_ENABLE_AI_ASSISTANT`: Habilita assistente IA
- `NEXT_PUBLIC_ENABLE_GAMIFICATION`: Habilita gamificação
- `NEXT_PUBLIC_ENABLE_TELEMETRY`: Habilita telemetria

Consulte [`.env.example`](./.env.example) para lista completa.

## 🤝 Contribuindo

1. Crie uma branch de feature a partir de `main`
2. Siga o formato Conventional Commits
3. Certifique-se de que todos os testes passem (quando implementados)
4. Submeta pull request com descrição clara

### Escopos de Commit Disponíveis

`planner`, `bncc`, `bloom`, `virtudes`, `auth`, `n8n`, `domain`, `ui`, `store`,
`api`, `telemetry`, `ai`, `assessment`, `calendar`, `approval`, `gamification`,
`integration`, `config`, `deps`

## 📝 Confirmações de Versão Pendentes

A equipe deve revisar e aprovar as versões marcadas com ⚠️ no
[`DEPENDENCY_VERSIONS.md`](./docs/development/DEPENDENCY_VERSIONS.md):

- Tailwind CSS: v4 vs v3.4
- Recharts: v3 vs v2
- Framer Motion: v12 vs v11
- Zod: v4 vs v3

## 📚 Recursos Adicionais

- [Documentação Next.js 15](https://nextjs.org/docs)
- [Documentação shadcn/ui](https://ui.shadcn.com)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação Zustand](https://zustand-demo.pmnd.rs)
- [Documentação React Hook Form](https://react-hook-form.com)
- [Documentação Zod](https://zod.dev)

## 🔗 Links Importantes

- **Especificações Técnicas**: [`Specs.md`](./Specs.md) (3168 linhas)
- **Fundamentos Pedagógicos**: [`docs/fundamentos/`](./docs/fundamentos/)
- **Versões de Dependências**:
  [`DEPENDENCY_VERSIONS.md`](./docs/development/DEPENDENCY_VERSIONS.md)
- **Guia de Setup**:
  [`SETUP_INSTRUCTIONS.md`](./docs/development/SETUP_INSTRUCTIONS.md)

## 🏆 Reconhecimentos

Créditos aos frameworks pedagógicos:

- **BNCC** (Base Nacional Comum Curricular)
- **Taxonomia de Bloom** (revisada)
- **Teoria de Competências de Perrenoud**
- **Framework de Virtudes Intelectuais**

## 📄 Licença

A ser determinado pela equipe.

## 📞 Contato

Para suporte ou dúvidas:

1. Consulte a seção de solução de problemas em
   [`SETUP_INSTRUCTIONS.md`](./docs/development/SETUP_INSTRUCTIONS.md)
2. Revise [`DEPENDENCY_VERSIONS.md`](./docs/development/DEPENDENCY_VERSIONS.md)
   para notas específicas de versão
3. Consulte a documentação da equipe
4. Entre em contato com a equipe de desenvolvimento

---

**Nota**: Este README cobre apenas a infraestrutura da Fase 1. Fases
subsequentes adicionarão design system, integração N8N, modelos de domínio e
funcionalidades.

**Última atualização**: 3 de outubro de 2025

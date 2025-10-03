# Guia de Conclusão da Configuração da Fase 1

Este guia detalha os passos necessários para completar a inicialização da Fase 1
do VirtuQuest.

## 📋 Passo 1: Verificar Versões das Dependências

Antes de instalar as dependências, a equipe deve confirmar as versões para
pacotes com mudanças incompatíveis:

### 1. **Revisar [`DEPENDENCY_VERSIONS.md`](./DEPENDENCY_VERSIONS.md)**

### 2. **Tomar decisões sobre:**

- **Tailwind CSS**: v4.1.13 (atual) ou v3.4.17 (EOL)
- **Recharts**: v3.2.1 (atual) ou v2.15.4 (último v2)
- **Framer Motion**: v12.23.12 (atual) ou v11.x
- **Zod**: v4.1.11 (atual) ou v3.x

### 3. **Atualizar `package.json`** com as versões confirmadas

### 4. **Documentar decisões** em [`DEPENDENCY_VERSIONS.md`](./DEPENDENCY_VERSIONS.md)

## 🔧 Passo 2: Instalar Dependências

```bash
# Usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install

# Ou usando yarn
yarn install
```

**Nota para usuários npm com React 19:** Se encontrar avisos de peer dependency
com npm:

```bash
npm install --legacy-peer-deps
```

## 🎯 Passo 3: Inicializar Husky

```bash
pnpm prepare
# Instala hooks Git para pre-commit linting e validação de mensagem de commit
```

Tornar arquivos de hook executáveis (Unix/Mac):

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

## 🔐 Passo 4: Configurar Variáveis de Ambiente

### 1. **Copiar arquivo de exemplo:**

```bash
cp .env.example .env.local
```

### 2. **Editar `.env.local`** com sua configuração:

- Definir `N8N_BASE_URL` para sua instância N8N
- Gerar segredos:
  ```bash
  openssl rand -base64 32  # Para JWT_SECRET
  openssl rand -base64 32  # Para JWT_REFRESH_SECRET
  openssl rand -base64 32  # Para N8N_WEBHOOK_SECRET
  ```
- Configurar feature flags conforme necessário
- Definir `NEXT_PUBLIC_APP_URL` para sua URL local (ex: `http://localhost:3000`)

### 3. **Validar ambiente:**

A aplicação validará variáveis de ambiente na inicialização usando
`src/lib/env.ts`

## 🎨 Passo 5: Inicializar shadcn/ui

```bash
npx shadcn@latest init
```

Quando solicitado:

- **Style**: **Default**
- **Base color**: **Slate**
- **CSS variables**: **Yes**
- **React Server Components**: **Yes**
- **TypeScript**: **Yes**
- **Import alias**: **@/components** (deve corresponder ao `components.json`)

**Nota:** O arquivo `components.json` já está configurado, então o CLI deve usar
essas configurações.

## 📦 Passo 6: Instalar Componentes shadcn/ui Essenciais

Instalar os componentes base necessários para a Fase 1:

```bash
# Componentes UI principais
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add badge
npx shadcn@latest add tooltip
npx shadcn@latest add command
npx shadcn@latest add sheet
npx shadcn@latest add skeleton
```

Ou instalar todos de uma vez:

```bash
npx shadcn@latest add button card dialog form input select table tabs toast badge tooltip command sheet skeleton
```

## ✅ Passo 7: Verificar Configuração TypeScript

```bash
pnpm type-check
```

Deve completar sem erros. Se houver erros, provavelmente são de componentes
shadcn/ui faltantes (instale conforme necessário).

## 🚀 Passo 8: Executar Servidor de Desenvolvimento

```bash
pnpm dev
```

A aplicação deve iniciar em `http://localhost:3000`

## 🔍 Passo 9: Verificar Setup

Confirmar que:

- ✅ Servidor de desenvolvimento executa sem erros
- ✅ Compilação TypeScript é bem-sucedida
- ✅ ESLint executa sem erros: `pnpm lint`
- ✅ Formatação Prettier funciona: `pnpm format`
- ✅ Hooks pre-commit funcionam (teste fazendo um commit)
- ✅ Validação de ambiente funciona (verificar console para erros de env)

## 🧪 Passo 10: Testar Fluxo de Commit

Testar o fluxo Git:

```bash
# Fazer uma pequena alteração
echo "# Teste" >> teste.md
git add teste.md

# Tentar commit com formato inválido (deve falhar)
git commit -m "commit de teste"

# Commit com formato válido (deve ser bem-sucedido)
git commit -m "docs: adicionar arquivo de teste"

# Limpar
git reset HEAD~1
rm teste.md
```

## 🔧 Solução de Problemas

### Problema: Avisos de Peer Dependency

**Solução:** Use flag `--legacy-peer-deps` com npm, ou mude para pnpm

### Problema: Hooks Husky Não Executam

**Solução:**

```bash
pnpm prepare
chmod +x .husky/*
```

### Problema: Componentes shadcn/ui Não Encontrados

**Solução:** Certifique-se de que os caminhos do `components.json` correspondem
aos aliases do `tsconfig.json`

### Problema: Erros de Validação de Ambiente

**Solução:** Verifique se `.env.local` tem todas as variáveis necessárias do
`.env.example`

### Problema: Classes Tailwind Não Funcionam

**Solução:**

- Verificar se `tailwind.config.ts` inclui seus arquivos nos caminhos de
  conteúdo
- Verificar se `globals.css` tem as diretivas Tailwind
- Reiniciar servidor de desenvolvimento

## 📈 Próximos Passos

Após completar a configuração da Fase 1:

1. **Revisar `Specs.md`** para especificações detalhadas de recursos
2. **Ler fundamentos pedagógicos** em `docs/fundamentos/`
3. **Prosseguir para Fase 1 - Design System** (próxima fase no plano de
   desenvolvimento)
4. **Configurar fluxos N8N** (equipe backend)
5. **Configurar pipeline CI/CD** (equipe DevOps)

## 📚 Recursos Adicionais

- [Documentação Next.js 15](https://nextjs.org/docs)
- [Documentação shadcn/ui](https://ui.shadcn.com)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação Zustand](https://zustand-demo.pmnd.rs)
- [Documentação React Hook Form](https://react-hook-form.com)
- [Documentação Zod](https://zod.dev)

## 🆘 Suporte

Se encontrar problemas:

1. Consulte esta seção de solução de problemas
2. Revise [`DEPENDENCY_VERSIONS.md`](./DEPENDENCY_VERSIONS.md) para notas
   específicas de versão
3. Consulte documentação da equipe
4. Entre em contato com a equipe de desenvolvimento

## 🎯 Checklist Final

- [ ] Versões de dependências confirmadas e documentadas
- [ ] Dependências instaladas com sucesso
- [ ] Hooks Husky configurados e funcionando
- [ ] Variáveis de ambiente configuradas e validadas
- [ ] shadcn/ui inicializado com componentes essenciais
- [ ] TypeScript compila sem erros
- [ ] Servidor de desenvolvimento executa
- [ ] Linting e formatação funcionam
- [ ] Fluxo de commit testado e funcionando
- [ ] Documentação revisada para próximas fases

---

**Nota:** Este guia de configuração cobre apenas a infraestrutura da Fase 1.
Fases subsequentes adicionarão design system, integração N8N, modelos de domínio
e recursos.

**Última atualização:** 3 de outubro de 2025

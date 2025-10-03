# Guia de Desenvolvimento

<cite>
**Arquivos Referenciados neste Documento**   
- [package.json](file://package.json)
- [README.md](file://README.md)
- [.npmrc](file://.npmrc)
- [commitlint.config.js](file://commitlint.config.js)
- [.env.example](file://.env.example)
- [tsconfig.json](file://tsconfig.json)
- [next.config.ts](file://next.config.ts)
- [eslint.config.mjs](file://eslint.config.mjs)
- [tailwind.config.ts](file://tailwind.config.ts)
- [src/lib/env.ts](file://src/lib/env.ts)
- [postcss.config.mjs](file://postcss.config.mjs)
- [components.json](file://components.json)
</cite>

## Sumário

1. [Introdução](#introdução)
2. [Configuração do Ambiente de Desenvolvimento](#configuração-do-ambiente-de-desenvolvimento)
3. [Scripts do Package.json](#scripts-do-packagejson)
4. [Fluxo Conventional Commits](#fluxo-conventional-commits)
5. [Configuração da IDE](#configuração-da-ide)
6. [Solução de Problemas Comuns](#solução-de-problemas-comuns)

## Introdução

Este guia fornece instruções práticas e detalhadas para desenvolvedores que
desejam contribuir com o projeto VirtuQuest, uma plataforma de planejamento
pedagógico integrado que combina BNCC, Taxonomia de Bloom e Virtudes
Intelectuais. O documento abrange desde a configuração inicial até práticas
avançadas de desenvolvimento, garantindo que todos os colaboradores sigam
padrões consistentes e eficientes.

**Section sources**

- [README.md](file://README.md#L1-L277)

## Configuração do Ambiente de Desenvolvimento

### Clonagem do Repositório

Para começar a contribuir com o projeto, o primeiro passo é clonar o repositório
para o ambiente local. Execute o seguinte comando no terminal:

```bash
git clone <url-do-repositorio>
cd virtuquest
```

Este comando cria uma cópia local do código-fonte, permitindo que você faça
alterações e contribuições.

### Instalação de Dependências com pnpm

O projeto utiliza **pnpm** como gerenciador de pacotes, com versão mínima
exigida de 9.0.0. Para instalar as dependências, execute:

```bash
pnpm install
```

A configuração do pnpm é definida no arquivo `.npmrc`, que inclui as seguintes
diretivas importantes:

- `auto-install-peers=true`: Garante que dependências de pares sejam instaladas
  automaticamente
- `shamefully-hoist=false`: Mantém o isolamento estrito de dependências
- `public-hoist-pattern[]`: Permite o hoisting de ferramentas essenciais como
  ESLint e Prettier para funcionamento correto dos hooks do Git

Essas configurações garantem um ambiente de desenvolvimento consistente e evitam
conflitos de dependências.

**Section sources**

- [package.json](file://package.json#L10-L13)
- [.npmrc](file://.npmrc#L1-L17)

### Configuração de Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configuração, com validação
rigorosa implementada via Zod no arquivo `src/lib/env.ts`. Para configurar o
ambiente:

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

2. Edite o arquivo `.env.local` com as configurações específicas do seu
   ambiente.

3. Gere segredos criptográficos seguros usando OpenSSL:

```bash
openssl rand -base64 32
```

As variáveis essenciais incluem:

- `NEXT_PUBLIC_APP_URL`: URL da aplicação
- `JWT_SECRET` e `JWT_REFRESH_SECRET`: Segredos para tokens JWT
- `N8N_BASE_URL` e `N8N_WEBHOOK_SECRET`: Configuração da integração N8N

O arquivo `src/lib/env.ts` valida todas as variáveis de ambiente na
inicialização, garantindo que valores obrigatórios estejam presentes e sejam do
tipo correto.

**Section sources**

- [.env.example](file://.env.example#L1-L105)
- [src/lib/env.ts](file://src/lib/env.ts#L1-L87)

### Inicialização de Hooks Git (Husky)

O projeto implementa um fluxo de commits padronizado através do Husky, com
validação automática via Commitlint. Para configurar os hooks do Git:

```bash
pnpm prepare
```

Este comando, definido no script `prepare` do `package.json`, executa
`husky install`, configurando os gatilhos do Git (hooks) que serão ativados
durante operações como commits. O lint-staged é configurado para executar ESLint
e Prettier automaticamente em arquivos modificados antes do commit, garantindo
consistência de código.

**Section sources**

- [package.json](file://package.json#L25-L26)
- [commitlint.config.js](file://commitlint.config.js#L1-L52)

### Execução do Servidor de Desenvolvimento

Após a configuração inicial, inicie o servidor de desenvolvimento com:

```bash
pnpm dev
```

Este comando executa `next dev --turbo`, iniciando o servidor Next.js com o modo
Turbo, que oferece tempos de inicialização e recarga mais rápidos. O servidor
estará disponível em `http://localhost:3000`.

A configuração do Next.js, definida em `next.config.ts`, inclui:

- Modo strict do React
- Minificação SWC
- Otimizações de imagem com padrões remotos para integrações como Khan Academy
- Cabeçalhos de segurança configurados (X-Frame-Options, X-Content-Type-Options,
  etc.)

**Section sources**

- [package.json](file://package.json#L14-L15)
- [next.config.ts](file://next.config.ts#L1-L109)

## Scripts do Package.json

O arquivo `package.json` define uma série de scripts que automatizam tarefas
comuns de desenvolvimento. Abaixo está a documentação completa de cada script:

### Scripts de Desenvolvimento

| Script         | Descrição                                                        |
| -------------- | ---------------------------------------------------------------- |
| `dev`          | Inicia o servidor de desenvolvimento com Next.js em modo Turbo   |
| `build`        | Compila a aplicação para produção                                |
| `start`        | Inicia o servidor de produção após o build                       |
| `lint`         | Executa o ESLint para análise estática de código                 |
| `lint:fix`     | Executa o ESLint com correção automática de problemas            |
| `format`       | Formata todo o código usando Prettier                            |
| `format:check` | Verifica se o código está formatado corretamente                 |
| `type-check`   | Executa a verificação de tipos do TypeScript sem emitir arquivos |
| `test`         | Placeholder para testes (a ser implementado na Fase 4)           |
| `prepare`      | Configura os hooks do Git com Husky                              |

**Section sources**

- [package.json](file://package.json#L14-L26)

### Configuração de Ferramentas de Qualidade de Código

O projeto utiliza uma combinação robusta de ferramentas para garantir qualidade
de código:

- **ESLint**: Configurado em `eslint.config.mjs` com regras para TypeScript,
  React e acessibilidade
- **Prettier**: Configurado com o plugin `prettier-plugin-tailwindcss` para
  ordenação inteligente de classes Tailwind
- **TypeScript**: Configurado em `tsconfig.json` com modo strict e checagem
  rigorosa de tipos
- **Tailwind CSS**: Configurado em `tailwind.config.ts` com sistema de cores
  baseado em variáveis CSS

A configuração do ESLint inclui regras estritas para TypeScript, como
`no-explicit-any`, `no-floating-promises` e `strict-boolean-expressions`, além
de regras de acessibilidade (WCAG 2.1 AA) através do plugin `jsx-a11y`.

**Section sources**

- [eslint.config.mjs](file://eslint.config.mjs#L1-L82)
- [tsconfig.json](file://tsconfig.json#L1-L49)
- [tailwind.config.ts](file://tailwind.config.ts#L1-L103)
- [postcss.config.mjs](file://postcss.config.mjs#L1-L8)

## Fluxo Conventional Commits

O projeto adota o padrão **Conventional Commits** para manter um histórico de
commits claro, consistente e automatizável. Este padrão facilita a geração
automática de changelogs, a identificação de alterações importantes e a
manutenção de uma versão semântica precisa.

### Formato do Commit

Cada commit deve seguir o formato:

```
tipo(escopo): descrição
```

Onde:

- **tipo**: O tipo da alteração (ex: feat, fix, docs)
- **escopo**: O módulo ou componente afetado (opcional)
- **descrição**: Uma breve descrição da alteração em minúsculas, sem ponto final

### Tipos de Commit Disponíveis

O arquivo `commitlint.config.js` define os tipos permitidos:

| Tipo       | Descrição                      | Exemplo                                               |
| ---------- | ------------------------------ | ----------------------------------------------------- |
| `feat`     | Nova funcionalidade            | `feat(planner): add BNCC selector component`          |
| `fix`      | Correção de bug                | `fix(auth): resolve JWT refresh token issue`          |
| `docs`     | Alterações na documentação     | `docs(readme): update installation instructions`      |
| `style`    | Mudanças de formatação         | `style(ui): format button component`                  |
| `refactor` | Refatoração de código          | `refactor(domain): extract Bloom taxonomy validation` |
| `perf`     | Melhorias de performance       | `perf(planner): optimize BNCC data loading`           |
| `test`     | Adição ou correção de testes   | `test(auth): add JWT validation tests`                |
| `chore`    | Tarefas de manutenção          | `chore(deps): update pnpm to 9.15.0`                  |
| `ci`       | Alterações em CI/CD            | `ci(github): update workflow actions`                 |
| `build`    | Alterações no sistema de build | `build: update next.config.ts`                        |
| `revert`   | Reversão de commits            | `revert: feat(planner): remove experimental feature`  |

### Escopos Disponíveis

Os escopos definidos no projeto representam os principais módulos e componentes:

`planner`, `bncc`, `bloom`, `virtudes`, `auth`, `n8n`, `domain`, `ui`, `store`,
`api`, `telemetry`, `ai`, `assessment`, `calendar`, `approval`, `gamification`,
`integration`, `config`, `deps`

### Exemplos de Commits Válidos

```bash
# Nova funcionalidade no planejador
git commit -m "feat(planner): add BNCC selector component"

# Correção de bug na autenticação
git commit -m "fix(auth): resolve JWT refresh token issue"

# Atualização da documentação
git commit -m "docs(readme): update installation instructions"

# Refatoração da lógica de domínio
git commit -m "refactor(domain): extract Bloom taxonomy validation"

# Melhoria de performance no carregamento de dados
git commit -m "perf(bncc): optimize competency tree loading"

# Alteração de configuração de dependências
git commit -m "chore(deps): update pnpm to 9.15.0"
```

O Husky e o Commitlint validam automaticamente cada commit, rejeitando mensagens
que não seguem o formato esperado. Isso garante que todo o histórico do
repositório permaneça limpo e padronizado.

**Section sources**

- [commitlint.config.js](file://commitlint.config.js#L1-L52)
- [README.md](file://README.md#L220-L240)

## Configuração da IDE

Para uma experiência de desenvolvimento ideal, configure sua IDE com os
seguintes plugins e configurações:

### Extensões Recomendadas

- **TypeScript**: Suporte nativo para verificação de tipos em tempo real
- **ESLint**: Integração com o ESLint para identificação de problemas de código
- **Prettier**: Formatação automática de código
- **Tailwind CSS IntelliSense**: Autocompletar e validação de classes Tailwind
- **EditorConfig**: Manutenção consistente de estilos de edição

### Configurações de Formatação

Configure sua IDE para:

- Formatar o código ao salvar (usando Prettier)
- Aplicar correções ESLint automaticamente ao salvar
- Usar espaços (2 ou 4) em vez de tabs
- Finalizar arquivos com nova linha
- Remover espaços em branco no final das linhas

### Atalhos Úteis

- **Ctrl+Shift+P** (ou Cmd+Shift+P): Abrir paleta de comandos
- **Ctrl+Alt+L** (ou Cmd+Alt+L): Formatar documento
- **Ctrl+Shift+I** (ou Cmd+Shift+I): Organizar imports
- **F2**: Renomear símbolo em todo o projeto

A configuração adequada da IDE reduz significativamente erros comuns e aumenta a
produtividade, permitindo que você se concentre na lógica de negócios em vez de
formatação e estilo.

**Section sources**

- [eslint.config.mjs](file://eslint.config.mjs#L1-L82)
- [prettier-plugin-tailwindcss](https://github.com/prettier/plugin-prettier)
- [tailwindcss-intellisense](https://tailwindcss.com/docs/editor-setup)

## Solução de Problemas Comuns

### Problemas com Versões do Node.js e pnpm

O projeto exige versões específicas do Node.js e pnpm, definidas no campo
`engines` do `package.json`:

```json
"engines": {
  "node": ">=20.0.0",
  "pnpm": ">=9.0.0"
}
```

**Solução**: Use um gerenciador de versões como `nvm` (Node Version Manager)
para instalar e alternar entre versões do Node.js:

```bash
# Instalar e usar Node.js 20
nvm install 20
nvm use 20

# Verificar versão do pnpm
pnpm --version

# Atualizar pnpm se necessário
npm install -g pnpm@9
```

### Erros de Build e TypeScript

Erros comuns incluem problemas de tipo e módulos não encontrados.

**Solução**:

1. Execute a verificação de tipos:

```bash
pnpm type-check
```

2. Limpe o cache e reinstale dependências:

```bash
pnpm clean
pnpm install
```

3. Verifique os aliases no `tsconfig.json`:

```json
"paths": {
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"]
}
```

### Problemas com Husky e Commits

Se os hooks do Git não estiverem funcionando:

**Solução**:

1. Reconfigure os hooks:

```bash
pnpm prepare
```

2. Verifique se o Husky está instalado:

```bash
pnpm list husky
```

3. Se necessário, reinstale:

```bash
pnpm add husky --save-dev
pnpm prepare
```

### Erros de Variáveis de Ambiente

Se a aplicação falhar devido a variáveis de ambiente ausentes:

**Solução**:

1. Verifique se o arquivo `.env.local` existe
2. Confira se todas as variáveis obrigatórias estão presentes:
   - `NEXT_PUBLIC_APP_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `N8N_BASE_URL`
   - `N8N_WEBHOOK_SECRET`

3. Valide as variáveis:

```bash
# O arquivo src/lib/env.ts valida automaticamente
# Qualquer erro será exibido no console
```

### Problemas com Tailwind CSS

Se as classes Tailwind não forem aplicadas:

**Solução**:

1. Verifique o arquivo `tailwind.config.ts`:

```typescript
content: [
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
];
```

2. Certifique-se de que os arquivos estão sendo incluídos corretamente no
   conteúdo

3. Reinicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Esses problemas são comuns em ambientes de desenvolvimento e geralmente podem
ser resolvidos com as etapas acima, garantindo um fluxo de trabalho suave e
produtivo.

**Section sources**

- [package.json](file://package.json#L10-L13)
- [src/lib/env.ts](file://src/lib/env.ts#L1-L87)
- [tailwind.config.ts](file://tailwind.config.ts#L1-L103)

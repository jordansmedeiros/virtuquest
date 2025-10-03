# Webhooks com N8N

<cite>
**Arquivos Referenciados neste Documento**  
- [env.ts](file://src/lib/env.ts)
- [next.config.ts](file://next.config.ts)
</cite>

## Sumário

1. [Introdução](#introdução)
2. [Variáveis de Ambiente e Validação com Zod](#variáveis-de-ambiente-e-validação-com-zod)
3. [Configuração de Webhooks no Next.js](#configuração-de-webhooks-no-nextjs)
4. [Validação de Formulários com React Hook Form e Zod](#validação-de-formulários-com-react-hook-form-e-zod)
5. [Autenticação JWT entre Frontend e Webhooks](#autenticação-jwt-entre-frontend-e-webhooks)
6. [Modo Mock para Testes Locais](#modo-mock-para-testes-locais)
7. [Headers de Segurança no Next.js](#headers-de-segurança-no-nextjs)
8. [Considerações de Rate Limiting e Logging](#considerações-de-rate-limiting-e-logging)
9. [Tratamento de Erros e Estratégias de Retry](#tratamento-de-erros-e-estratégias-de-retry)
10. [Conclusão](#conclusão)

## Introdução

O sistema frontend do Virtuquest utiliza integração via webhooks com a
plataforma N8N para executar operações assíncronas críticas, como criação de
planos pedagógicos, geração de avaliações automatizadas e sincronização de dados
em modo offline. Esta arquitetura permite desacoplar processos intensivos do
fluxo principal da aplicação, melhorando a responsividade da interface e
garantindo confiabilidade nas operações de backend.

A integração é configurada através de variáveis de ambiente rigorosamente
validadas com Zod, garantindo segurança e tipagem estática em todo o processo. O
frontend envia dados validados de formulários (usando React Hook Form combinado
com Zod) para endpoints do N8N configurados no `next.config.ts`, com
autenticação baseada em JWT e proteção adicional por segredos de webhook.

## Variáveis de Ambiente e Validação com Zod

O Virtuquest implementa um sistema robusto de validação de variáveis de ambiente
utilizando Zod, garantindo que todas as configurações críticas sejam verificadas
em tempo de inicialização da aplicação.

### Variáveis de Configuração do N8N

As variáveis essenciais para a integração com N8N são definidas no arquivo
`src/lib/env.ts` com validações rigorosas:

- **`N8N_BASE_URL`**: URL da instância N8N, validada como URL válida
- **`N8N_API_KEY`**: Chave de API opcional para autenticação com o N8N
- **`N8N_WEBHOOK_SECRET`**: Segredo com no mínimo 32 caracteres para assinatura
  e verificação de webhooks

Essas variáveis são definidas no schema do lado do servidor (`serverSchema`)
pois contêm informações sensíveis que não devem ser expostas no cliente.

### Validação e Tipagem Estática

O sistema utiliza Zod para validação em tempo de execução e geração automática
de tipos TypeScript. O processo de validação ocorre na função `validateEnv()`,
que lança um erro descritivo caso alguma variável esteja ausente ou inválida,
listando todos os problemas encontrados.

A tipagem rigorosa permite acesso seguro às variáveis em toda a aplicação
através do objeto `env`, com autocomplete e verificação de tipo fornecidos pelo
TypeScript.

**Section sources**

- [env.ts](file://src/lib/env.ts#L4-L6)

## Configuração de Webhooks no Next.js

A configuração do N8N no frontend é gerenciada principalmente através do arquivo
`next.config.ts`, que define as configurações essenciais para a integração.

### Configuração de Ambiente

O `next.config.ts` inclui a variável `N8N_BASE_URL` no objeto `env`, garantindo
que esta configuração esteja disponível durante o processo de build do Next.js:

```typescript
env: {
  N8N_BASE_URL: process.env.N8N_BASE_URL,
}
```

### Proxy de API (Potencial)

Embora atualmente comentado, o arquivo contém um placeholder para rewrites que
poderia ser usado para criar um proxy entre o frontend e a API do N8N:

```typescript
// Rewrites placeholder for API proxy to N8N if needed
async rewrites() {
  return [
    // {
    //   source: '/api/n8n/:path*',
    //   destination: `${process.env.N8N_BASE_URL}/api/:path*`,
    // },
  ];
}
```

Esta configuração permitiria rotear requisições do frontend para a instância do
N8N, ocultando a URL real do serviço e adicionando uma camada adicional de
segurança.

**Section sources**

- [next.config.ts](file://next.config.ts#L85-L87)

## Validação de Formulários com React Hook Form e Zod

Embora os arquivos específicos de formulários não estejam disponíveis, a análise
do `package.json` confirma que o projeto utiliza `react-hook-form` (versão
7.63.0) combinado com `@hookform/resolvers` e `zod` para validação de
formulários.

### Arquitetura de Validação

A integração entre React Hook Form e Zod permite:

1. **Validação em tempo real**: Validação instantânea dos campos do formulário
2. **Tipagem unificada**: Os esquemas de validação do Zod são usados tanto para
   validação quanto para tipagem TypeScript
3. **Feedback ao usuário**: Mensagens de erro detalhadas baseadas nas validações
   do Zod
4. **Envio seguro**: Dados são validados antes de serem enviados aos webhooks do
   N8N

### Processo de Envio

Quando um formulário é submetido:

1. Os dados são validados localmente usando o esquema Zod
2. Os dados validados são estruturados em um payload apropriado
3. O payload é enviado para o endpoint do N8N correspondente
4. O frontend aguarda a resposta assíncrona do fluxo de trabalho

Esta abordagem garante que apenas dados válidos sejam enviados para
processamento, reduzindo erros no backend e melhorando a experiência do usuário.

**Section sources**

- [package.json](file://package.json#L10-L11)

## Autenticação JWT entre Frontend e Webhooks

O sistema implementa um mecanismo robusto de autenticação utilizando JWT (JSON
Web Tokens) para proteger a comunicação entre o frontend e os webhooks do N8N.

### Configuração de Segurança

As chaves JWT são definidas como variáveis de ambiente com requisitos rigorosos:

- **`JWT_SECRET`**: Segredo com no mínimo 32 caracteres para assinatura de
  tokens de acesso
- **`JWT_REFRESH_SECRET`**: Segredo separado com no mínimo 32 caracteres para
  tokens de refresh

Essas chaves são usadas para assinar tokens que podem ser enviados junto com as
requisições aos webhooks do N8N, garantindo que apenas clientes autenticados
possam acionar os fluxos de trabalho.

### Fluxo de Autenticação

1. O usuário realiza login no frontend
2. O backend gera um JWT assinado com `JWT_SECRET`
3. O frontend armazena o token de forma segura
4. Ao acionar um webhook do N8N, o token é incluído no header `Authorization`
5. O N8N valida o token antes de executar o fluxo de trabalho

Esta abordagem permite autenticação stateless e escalável, ideal para operações
assíncronas.

**Section sources**

- [env.ts](file://src/lib/env.ts#L8-L9)

## Modo Mock para Testes Locais

O sistema inclui um recurso importante para desenvolvimento e testes locais
através da variável de ambiente `NEXT_PUBLIC_MOCK_N8N`.

### Funcionalidade de Mock

Quando `NEXT_PUBLIC_MOCK_N8N` é definido como `true`:

1. O frontend pode simular respostas de webhooks sem realmente conectar à
   instância do N8N
2. Permite desenvolvimento offline e testes rápidos
3. Facilita demonstrações sem dependência de infraestrutura externa
4. Reduz custos de desenvolvimento ao evitar chamadas reais

### Configuração

A variável é definida no schema do cliente (`clientSchema`) com transformação de
string para booleano:

```typescript
NEXT_PUBLIC_MOCK_N8N: z
  .string()
  .transform((v) => v === 'true')
  .default('false'),
```

Isso permite que o código frontend verifique facilmente se está em modo mock e
altere seu comportamento apropriadamente.

**Section sources**

- [env.ts](file://src/lib/env.ts#L27-L29)

## Headers de Segurança no Next.js

O arquivo `next.config.ts` configura headers de segurança importantes que
protegem a aplicação e, por extensão, a integração com o N8N.

### Headers Implementados

```typescript
{
  key: 'X-DNS-Prefetch-Control',
  value: 'on',
},
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN',
},
{
  key: 'X-Content-Type-Options',
  value: 'nosniff',
},
{
  key: 'Referrer-Policy',
  value: 'origin-when-cross-origin',
},
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=()',
}
```

### Proteção contra Ataques

Esses headers fornecem proteção contra várias vulnerabilidades:

- **X-Frame-Options**: Previne ataques de clickjacking
- **X-Content-Type-Options**: Impede sniffing de MIME type
- **Referrer-Policy**: Controla informações de referência enviadas
- **Permissions-Policy**: Restringe acesso a APIs sensíveis do navegador

A política de permissões desativa explicitamente acesso à câmera, microfone e
geolocalização, reduzindo a superfície de ataque.

**Section sources**

- [next.config.ts](file://next.config.ts#L52-L68)

## Considerações de Rate Limiting e Logging

Embora o rate limiting específico para webhooks não esteja configurado no
frontend, o sistema inclui mecanismos de logging que podem ser usados para
monitorar e implementar limitação de taxa.

### Logging de Requisições

O `next.config.ts` habilita logging detalhado de requisições fetch:

```typescript
logging: {
  fetches: {
    fullUrl: true,
  },
}
```

Esta configuração registra todas as requisições fetch com URLs completas,
permitindo:

- Monitoramento de chamadas aos webhooks do N8N
- Identificação de padrões de uso
- Detecção de abuso ou chamadas excessivas
- Auditoria de segurança

### Estratégias de Rate Limiting

Embora não implementado diretamente no frontend, o logging detalhado permite que
soluções de rate limiting sejam implementadas:

1. **No N8N**: O próprio N8N pode implementar limitação de taxa baseada nos logs
2. **Em camada intermediária**: Um proxy ou API gateway pode analisar os padrões
   de requisição
3. **No frontend**: O código frontend pode implementar debouncing ou throttling
   para chamadas frequentes

## Tratamento de Erros e Estratégias de Retry

O sistema implementa estratégias robustas de tratamento de erros em múltiplos
níveis para garantir confiabilidade na integração com o N8N.

### Validação de Ambiente

A função `validateEnv()` no `env.ts` implementa tratamento de erros detalhado:

```typescript
if (error instanceof z.ZodError) {
  const missingVars = error.errors
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join('\n');

  console.error('❌ Invalid environment variables:\n', missingVars);
  throw new Error('Environment validation failed');
}
```

Esta abordagem fornece mensagens de erro claras que identificam exatamente quais
variáveis estão ausentes ou inválidas.

### Estratégias de Retry

Embora não explicitamente codificadas nos arquivos analisados, as melhores
práticas para integração com webhooks sugerem:

1. **Exponential Backoff**: Tentativas com intervalos crescentes (1s, 2s, 4s,
   8s)
2. **Circuit Breaker**: Parar tentativas após falhas consecutivas para evitar
   sobrecarga
3. **Fila de Retentativas**: Armazenar chamadas falhas para processamento
   posterior
4. **Notificação de Falha**: Informar o usuário sobre falhas persistentes

O modo mock (`NEXT_PUBLIC_MOCK_N8N`) facilita o teste dessas estratégias em
ambiente de desenvolvimento.

## Conclusão

A integração com N8N no frontend do Virtuquest é uma arquitetura bem projetada
que combina segurança, confiabilidade e desenvolvimento eficiente. A utilização
de Zod para validação de variáveis de ambiente e formulários garante tipagem
rigorosa e segurança. A autenticação JWT protege as comunicações, enquanto os
headers de segurança no `next.config.ts` fortalecem a aplicação contra
vulnerabilidades comuns.

O recurso de mock permite desenvolvimento e testes locais eficientes, e o
sistema de logging detalhado fornece base para monitoramento e implementação de
rate limiting. Embora estratégias de retry não estejam explicitamente
implementadas nos arquivos analisados, a estrutura existente suporta facilmente
sua adição.

Esta integração permite que o Virtuquest execute operações assíncronas complexas
de forma confiável, mantendo uma interface responsiva e segura para os usuários.

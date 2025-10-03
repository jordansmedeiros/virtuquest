# Guia de Integração N8N - VirtuQuest

Documentação completa da camada de integração N8N para desenvolvedores.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Cliente N8N](#cliente-n8n)
4. [Endpoints Disponíveis](#endpoints-disponíveis)
5. [Estratégias de Resiliência](#estratégias-de-resiliência)
6. [Sistema de Cache](#sistema-de-cache)
7. [Hooks React](#hooks-react)
8. [Tratamento de Erros](#tratamento-de-erros)
9. [Exemplos de Uso](#exemplos-de-uso)
10. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

A camada de integração N8N fornece:

- ✅ Cliente HTTP tipado com TypeScript
- ✅ Retry exponencial automático
- ✅ Circuit breaker por endpoint
- ✅ Timeout configurável
- ✅ Cache imutável para catálogos
- ✅ Hooks React para UI
- ✅ Tratamento de erros pedagógicos
- ✅ Suporte a Server Actions

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
src/core/infrastructure/
├── n8n/
│   ├── client.ts          # Cliente HTTP principal
│   ├── types.ts           # Tipos TypeScript
│   ├── endpoints.ts       # Mapeamento de endpoints
│   ├── errors.ts          # Hierarquia de erros
│   └── index.ts           # Exports públicos
├── resilience/
│   ├── retry.ts           # Estratégia de retry
│   ├── circuit-breaker.ts # Circuit breaker
│   └── timeout.ts         # Gerenciamento de timeout
└── cache/
    └── catalog-cache.ts   # Cache de catálogos
```

### Fluxo de Requisição

```
Component
  ↓
Hook (useN8NWorkflow)
  ↓
N8NClient
  ↓
Circuit Breaker → verifica estado
  ↓
Timeout Manager → aplica timeout
  ↓
Retry Policy → tenta até 3x
  ↓
HTTP Request (fetch)
  ↓
N8N Webhook
```

## 🔌 Cliente N8N

### Configuração

O cliente é configurado automaticamente via variáveis de ambiente:

```typescript
// .env.local
N8N_BASE_URL=https://n8n.virtuquest.com
N8N_API_KEY=your-api-key
CACHE_TTL_BNCC=86400
CACHE_TTL_BLOOM=86400
CACHE_TTL_VIRTUDES=86400
```

### Uso Básico

```typescript
import { n8nClient } from '@/core/infrastructure/n8n';

// Criar plano de aula
const plan = await n8nClient.createPlan({
  professor: 'prof-123',
  disciplina: 'Matemática',
  nivel: PlanLevel.FUNDAMENTAL_I,
  competenciasBNCC: ['EF01MA01'],
  objetivosBloom: [BloomLevel.ENTENDER, BloomLevel.APLICAR],
  virtudes: ['Prudência', 'Temperança'],
  conteudo: {
    titulo: 'Adição de números naturais',
    descricao: 'Introdução à operação de adição',
    objetivos: ['Compreender o conceito de adição'],
    metodologia: 'Aula expositiva com material concreto',
    recursos: ['Blocos lógicos', 'Quadro branco'],
    avaliacao: 'Exercícios práticos',
    duracao: 60,
  },
});

// Sugerir conteúdo com IA
const suggestions = await n8nClient.suggestContent({
  contexto: {
    disciplina: 'Matemática',
    serie: '1º ano',
    competencias: ['EF01MA01'],
    nivelBloom: [BloomLevel.ENTENDER],
    virtudes: ['Prudência'],
    duracao: 60,
    recursos: ['Material concreto'],
  },
});

// Buscar catálogos
const bnccCatalog = await n8nClient.fetchBNCCCatalog();
const bloomCatalog = await n8nClient.fetchBloomCatalog();
const virtuesCatalog = await n8nClient.fetchVirtuesCatalog();
```

### Server Actions

```typescript
'use server';

import { executeN8NWorkflow } from '@/core/infrastructure/n8n';

export async function createPlanAction(data: CreatePlanRequest) {
  return executeN8NWorkflow<CreatePlanRequest, CreatePlanResponse>(
    '/webhook/planning/create',
    data
  );
}
```

## 📍 Endpoints Disponíveis

### Usuários

```typescript
const endpoints = N8N_ENDPOINTS.usuarios;

// criar: '/webhook/user/create'
// autenticar: '/webhook/user/auth'
// atualizar: '/webhook/user/update'
// listar: '/webhook/user/list'
```

### Planejamento

```typescript
const endpoints = N8N_ENDPOINTS.planejamento;

// criarPlano: '/webhook/planning/create'
// atualizarPlano: '/webhook/planning/update'
// aprovarPlano: '/webhook/planning/approve'
// consultarPlanos: '/webhook/planning/query'
// buscarPorId: '/webhook/planning/get'
// deletarPlano: '/webhook/planning/delete'
```

### IA

```typescript
const endpoints = N8N_ENDPOINTS.ia;

// sugerirConteudo: '/webhook/ai/suggest-content'
// analisarAlinhamento: '/webhook/ai/analyze-alignment'
// gerarAvaliacao: '/webhook/ai/generate-assessment'
```

### Relatórios

```typescript
const endpoints = N8N_ENDPOINTS.relatorios;

// progressoBNCC: '/webhook/reports/bncc-progress'
// desenvolvimentoVirtudes: '/webhook/reports/virtues-development'
```

### Telemetria

```typescript
const endpoints = N8N_ENDPOINTS.telemetria;

// registrarEvento: '/webhook/analytics/pedagogical'
// buscarMetricas: '/webhook/analytics/metrics'
```

### Catálogos

```typescript
const endpoints = N8N_ENDPOINTS.catalogos;

// buscarBNCC: '/webhook/catalogs/bncc'
// buscarBloom: '/webhook/catalogs/bloom'
// buscarVirtudes: '/webhook/catalogs/virtues'
```

## 🛡️ Estratégias de Resiliência

### Retry Exponencial

Configuração padrão:
- **Max retries**: 3 tentativas
- **Initial delay**: 1000ms
- **Max delay**: 10000ms
- **Backoff multiplier**: 2x
- **Jitter**: ±10% aleatório

```typescript
import { withRetry } from '@/core/infrastructure/resilience/retry';

const result = await withRetry(
  async () => await fetchData(),
  {
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (attempt, error, delay) => {
      console.log(`Retry ${attempt} após ${delay}ms`);
    },
  }
);
```

### Circuit Breaker

Configuração padrão:
- **Failure threshold**: 5 falhas consecutivas
- **Reset timeout**: 60000ms (1 minuto)
- **Half-open attempts**: 3 tentativas

Estados:
- **CLOSED**: Normal, requisições passam
- **OPEN**: Circuito aberto, requisições bloqueadas
- **HALF_OPEN**: Teste de recuperação

```typescript
import { CircuitBreaker } from '@/core/infrastructure/resilience/circuit-breaker';

const breaker = new CircuitBreaker('my-endpoint', {
  failureThreshold: 5,
  resetTimeout: 60000,
  onStateChange: (oldState, newState) => {
    console.log(`Circuit: ${oldState} → ${newState}`);
  },
});

await breaker.execute(async () => {
  return await fetchData();
});
```

### Timeout

Configuração padrão:
- **Default timeout**: 30000ms (30 segundos)

```typescript
import { withTimeout } from '@/core/infrastructure/resilience/timeout';

const result = await withTimeout(
  fetchData(),
  5000, // 5 segundos
  'Operação demorou muito'
);
```

## 💾 Sistema de Cache

### Cache de Catálogos

Catálogos BNCC, Bloom e Virtudes são cacheados automaticamente:

```typescript
import { EducationalCatalogCache } from '@/core/infrastructure/cache/catalog-cache';

const cache = new EducationalCatalogCache({
  bncc: 86400, // 24 horas
  bloom: 86400,
  virtues: 86400,
});

// Hidratar cache
await cache.hydrate({
  fetchBNCC: async () => await n8nClient.fetchBNCCCatalog(),
  fetchBloom: async () => await n8nClient.fetchBloomCatalog(),
  fetchVirtues: async () => await n8nClient.fetchVirtuesCatalog(),
});

// Acessar catálogos
const bncc = cache.getBNCC();
const bloom = cache.getBloom();
const virtues = cache.getVirtues();

// Invalidar cache
cache.invalidateCatalogs();
```

### Características

- **Imutabilidade**: Dados cacheados são congelados (Object.freeze)
- **TTL configurável**: Via variáveis de ambiente
- **LRU eviction**: Remove entradas menos usadas quando limite atingido
- **Estatísticas**: Hit rate, tamanho, entradas mais acessadas

## ⚛️ Hooks React

### useN8NWorkflow

Hook genérico para executar workflows:

```typescript
import { useN8NWorkflow } from '@/hooks';

function MyComponent() {
  const { execute, data, isLoading, error } = useN8NWorkflow<Request, Response>(
    '/webhook/my-endpoint',
    {
      onSuccess: (data) => toast.success('Sucesso!'),
      onError: (error) => toast.error(error.message),
      enableCache: true,
      cacheKey: 'my-data',
    }
  );

  return (
    <button onClick={() => execute(requestData)} disabled={isLoading}>
      {isLoading ? 'Carregando...' : 'Executar'}
    </button>
  );
}
```

### Hooks Especializados

```typescript
// Planejamento
import {
  useCreatePlan,
  useUpdatePlan,
  useApprovePlan,
  useQueryPlans,
} from '@/hooks';

// IA
import {
  useSuggestContent,
  useAnalyzeAlignment,
  useGenerateAssessment,
} from '@/hooks';

// Exemplo
function CreatePlanForm() {
  const { execute, isLoading, error } = useCreatePlan({
    onSuccess: (plan) => {
      toast.success('Plano criado!');
      router.push(`/planos/${plan.id}`);
    },
  });

  return <form onSubmit={() => execute(formData)}>...</form>;
}
```

### Hooks de Catálogos

```typescript
import {
  useBNCCCatalog,
  useBloomCatalog,
  useVirtuesCatalog,
  useAllCatalogs,
  useBNCCCompetency,
  useBNCCHabilidade,
  useBloomLevel,
  useVirtue,
} from '@/hooks';

// Buscar catálogo completo
function BNCCSelector() {
  const { catalog, isLoading, error } = useBNCCCatalog();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return (
    <select>
      {catalog?.competencias.map((comp) => (
        <option key={comp.codigo} value={comp.codigo}>
          {comp.codigo} - {comp.descricao}
        </option>
      ))}
    </select>
  );
}

// Buscar item específico
function CompetencyDetails({ codigo }: { codigo: string }) {
  const competency = useBNCCCompetency(codigo);

  if (!competency) return <NotFound />;

  return (
    <div>
      <h2>{competency.codigo}</h2>
      <p>{competency.descricao}</p>
    </div>
  );
}

// Buscar todos os catálogos
function PlannerEditor() {
  const { bncc, bloom, virtues, isLoading } = useAllCatalogs();

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <BNCCSection catalog={bncc} />
      <BloomSection catalog={bloom} />
      <VirtuesSection catalog={virtues} />
    </div>
  );
}
```

## ❌ Tratamento de Erros

### Hierarquia de Erros

```typescript
N8NError (base)
├── NetworkError
│   ├── TimeoutError
│   └── ConnectionRefusedError
├── AuthenticationError
├── AuthorizationError
├── ValidationError
├── SchemaValidationError
├── Erros Pedagógicos
│   ├── PedagogicalAlignmentError
│   ├── CompetencyNotFoundError
│   ├── InvalidBloomLevelError
│   ├── PlanApprovalError
│   └── CurriculumGapError
└── Erros de Resiliência
    ├── CircuitBreakerOpenError
    └── RetryExhaustedError
```

### Tradução de Erros

```typescript
import { translateN8NError, formatErrorForUser } from '@/core/infrastructure/n8n';

try {
  await n8nClient.createPlan(data);
} catch (error) {
  const n8nError = translateN8NError(error);

  // Mensagem amigável para usuário
  const userMessage = formatErrorForUser(n8nError);
  toast.error(userMessage);

  // Log estruturado
  console.error(n8nError.toJSON());
}
```

### Verificações de Erro

```typescript
import { isRetryableError, getErrorSeverity } from '@/core/infrastructure/n8n';

if (isRetryableError(error)) {
  // Retry automático será executado
}

const severity = getErrorSeverity(error); // 'low' | 'medium' | 'high' | 'critical'

if (severity === 'critical') {
  // Alertar equipe de operações
}
```

## 📚 Exemplos de Uso

### Criar Plano de Aula

```typescript
'use client';

import { useCreatePlan } from '@/hooks';
import { BloomLevel, PlanLevel } from '@/core/infrastructure/n8n';

export function CreatePlanForm() {
  const { execute, isLoading, error } = useCreatePlan({
    onSuccess: (plan) => {
      toast.success(`Plano "${plan.plano.conteudo.titulo}" criado!`);
      router.push(`/planos/${plan.id}`);
    },
    onError: (error) => {
      toast.error(formatErrorForUser(error));
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await execute({
      professor: session.user.id,
      disciplina: 'Matemática',
      nivel: PlanLevel.FUNDAMENTAL_I,
      competenciasBNCC: ['EF01MA01', 'EF01MA02'],
      objetivosBloom: [BloomLevel.ENTENDER, BloomLevel.APLICAR],
      virtudes: ['Prudência', 'Temperança'],
      conteudo: {
        titulo: 'Adição de números naturais',
        descricao: 'Introdução à operação de adição usando material concreto',
        objetivos: [
          'Compreender o conceito de adição',
          'Resolver problemas simples de adição',
        ],
        metodologia:
          'Aula expositiva dialogada com uso de blocos lógicos e situações-problema contextualizadas',
        recursos: ['Blocos lógicos', 'Quadro branco', 'Fichas de exercícios'],
        avaliacao: 'Observação durante atividades e exercícios escritos',
        duracao: 60,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Criando plano...' : 'Criar Plano'}
      </Button>
      {error && <ErrorAlert error={error} />}
    </form>
  );
}
```

### Sugerir Conteúdo com IA

```typescript
'use client';

import { useSuggestContent } from '@/hooks';

export function ContentSuggester() {
  const { execute, data, isLoading } = useSuggestContent();

  const handleSuggest = async () => {
    await execute({
      contexto: {
        disciplina: 'Matemática',
        serie: '1º ano',
        competencias: ['EF01MA01'],
        nivelBloom: [BloomLevel.ENTENDER, BloomLevel.APLICAR],
        virtudes: ['Prudência', 'Temperança'],
        duracao: 60,
        recursos: ['Material concreto', 'Quadro branco'],
        perfilTurma: 'Turma com 25 alunos, nível heterogêneo',
      },
    });
  };

  return (
    <div>
      <Button onClick={handleSuggest} disabled={isLoading}>
        {isLoading ? 'Gerando sugestões...' : 'Sugerir Conteúdo'}
      </Button>

      {data && (
        <div className="mt-4 space-y-4">
          {data.sugestoes.map((sugestao, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{sugestao.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{sugestao.descricao}</p>
                <h4 className="mt-4 font-semibold">Recursos:</h4>
                <ul>
                  {sugestao.recursos.map((recurso, i) => (
                    <li key={i}>{recurso}</li>
                  ))}
                </ul>
                <h4 className="mt-4 font-semibold">Atividades:</h4>
                <ul>
                  {sugestao.atividades.map((atividade, i) => (
                    <li key={i}>
                      {atividade.nome} ({atividade.duracao}min) -{' '}
                      {atividade.nivelBloom}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Analisar Alinhamento Pedagógico

```typescript
'use client';

import { useAnalyzeAlignment } from '@/hooks';

export function AlignmentAnalyzer({ planoId }: { planoId: string }) {
  const { execute, data, isLoading } = useAnalyzeAlignment();

  useEffect(() => {
    execute({
      planoId,
      competenciasBNCC: ['EF01MA01', 'EF01MA02'],
      objetivosBloom: [BloomLevel.ENTENDER, BloomLevel.APLICAR],
    });
  }, [planoId]);

  if (isLoading) return <Skeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Alinhamento Pedagógico</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Score de Alinhamento</h4>
            <Progress value={data?.score} max={100} />
            <p className="text-sm text-muted-foreground">{data?.score}%</p>
          </div>

          {data?.gaps && data.gaps.length > 0 && (
            <div>
              <h4 className="font-semibold">Gaps Identificados</h4>
              <ul className="list-disc pl-5">
                {data.gaps.map((gap, i) => (
                  <li key={i} className="text-sm">
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data?.recomendacoes && data.recomendacoes.length > 0 && (
            <div>
              <h4 className="font-semibold">Recomendações</h4>
              <ul className="list-disc pl-5">
                {data.recomendacoes.map((rec, i) => (
                  <li key={i} className="text-sm">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Seletor de Competências BNCC

```typescript
'use client';

import { useBNCCCatalog } from '@/hooks';

export function BNCCCompetencySelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (codes: string[]) => void;
}) {
  const { catalog, isLoading, error } = useBNCCCatalog();

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-2">
      <Label>Competências BNCC</Label>
      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
        {catalog?.competencias.map((comp) => (
          <div key={comp.codigo} className="flex items-start space-x-2">
            <Checkbox
              id={comp.codigo}
              checked={value.includes(comp.codigo)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...value, comp.codigo]);
                } else {
                  onChange(value.filter((c) => c !== comp.codigo));
                }
              }}
            />
            <Label htmlFor={comp.codigo} className="text-sm font-normal">
              <span className="font-semibold">{comp.codigo}</span> -{' '}
              {comp.descricao}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Troubleshooting

### Erro: Circuit Breaker Aberto

**Problema**: `CircuitBreakerOpenError: Circuit breaker aberto para /webhook/...`

**Causa**: Endpoint sofreu 5+ falhas consecutivas

**Solução**:
1. Verificar logs do N8N
2. Aguardar 60 segundos (reset timeout)
3. Verificar conectividade
4. Resetar manualmente: `circuitBreakerManager.resetAll()`

### Erro: Timeout

**Problema**: `TimeoutError: Requisição excedeu tempo limite`

**Causa**: Operação demorou mais de 30 segundos

**Solução**:
1. Aumentar timeout para operação específica:
   ```typescript
   await n8nClient.request(endpoint, data, { timeout: 60000 });
   ```
2. Otimizar workflow N8N
3. Verificar latência de rede

### Erro: Competência Não Encontrada

**Problema**: `CompetencyNotFoundError: Competência BNCC 'XXX' não encontrada`

**Causa**: Código BNCC inválido ou catálogo desatualizado

**Solução**:
1. Verificar código no catálogo BNCC
2. Invalidar cache: `cache.invalidateCatalogs()`
3. Atualizar workflow N8N com catálogo mais recente

### Erro: Retry Esgotado

**Problema**: `RetryExhaustedError: Todas as 3 tentativas falharam`

**Causa**: Erro persistente após retries

**Solução**:
1. Verificar logs de cada tentativa
2. Identificar erro raiz (rede, validação, etc.)
3. Corrigir causa raiz
4. Considerar aumentar max retries para operações críticas

### Debug de Requisições

Habilitar logs detalhados:

```typescript
// .env.local
LOG_LEVEL=debug

// Ou programaticamente
const client = new N8NClient({
  enableLogging: true,
});

client.addRequestInterceptor((endpoint, data) => {
  console.log('Request:', { endpoint, data });
  return { endpoint, data };
});

client.addResponseInterceptor((endpoint, response) => {
  console.log('Response:', { endpoint, response });
  return response;
});
```

### Métricas e Monitoramento

```typescript
// Obter métricas do cliente
const metrics = n8nClient.getMetrics();

console.log('Total requests:', metrics.totalRequests);
console.log('Success rate:', metrics.successRate);
console.log('Avg response time:', metrics.averageResponseTime);
console.log('Circuit breakers:', metrics.circuitBreakerMetrics);
console.log('Timeouts:', metrics.timeoutMetrics);
console.log('Retries:', metrics.retryMetrics);
```

## 📝 Checklist de Integração

Ao integrar um novo endpoint N8N:

- [ ] Definir tipos em `types.ts` (Request, Response)
- [ ] Adicionar endpoint em `endpoints.ts`
- [ ] Mapear tipos em `EndpointTypeMap`
- [ ] Criar método no `N8NClient`
- [ ] Criar hook especializado (opcional)
- [ ] Adicionar testes (futuramente)
- [ ] Documentar no guia
- [ ] Atualizar Specs.md se necessário

## 🔗 Referências

- [Specs.md](./SPECS.md) - Especificações completas do projeto
- [N8N Documentation](https://docs.n8n.io/) - Documentação oficial N8N
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Guia TypeScript
- [React Hooks](https://react.dev/reference/react) - Documentação React Hooks

---

**Última atualização**: 2025-10-03
**Versão**: 1.0.0
**Maintainer**: Equipe VirtuQuest

# Camada de Domínio Pedagógico

Esta camada implementa os modelos pedagógicos fundamentais do VirtuQuest,
seguindo princípios de **Domain-Driven Design** e alinhamento rigoroso com
fundamentos teóricos.

## Visão Geral

A camada de domínio é organizada em **4 agregados pedagógicos**:

1. **BNCC** - Base Nacional Comum Curricular
2. **Bloom** - Taxonomia de Bloom Revisada
3. **Perrenoud** - Teoria das Competências
4. **Virtudes** - Virtudes Intelectuais

## Estrutura

```
src/core/domain/
├── bncc/                    # Agregado BNCC
│   ├── types.ts            # Tipos (Competências, Habilidades, Objetos)
│   ├── decomposer.ts       # Utilitário de decomposição de códigos
│   ├── repository.ts       # Catálogo com dados seed
│   └── index.ts
├── bloom/                   # Agregado Bloom
│   ├── types.ts            # Tipos (Processos, Conhecimentos, Células)
│   ├── matriz.ts           # Matriz 6×4 completa (24 células)
│   ├── repository.ts       # Catálogo com verbos e classificação
│   └── index.ts
├── perrenoud/               # Agregado Perrenoud
│   ├── types.ts            # Tipos (Competências, Situações-Problema)
│   └── index.ts
├── virtudes/                # Agregado Virtudes
│   ├── types.ts            # Tipos (Virtudes, Indicadores)
│   ├── repository.ts       # Catálogo com 6 virtudes core
│   └── index.ts
├── shared/                  # Tipos Compartilhados
│   ├── types.ts            # Alinhamento, Hierarquia, Validações
│   └── index.ts
├── index.ts                 # Exportações centralizadas
└── README.md                # Esta documentação
```

## Agregados

### 1. BNCC (Base Nacional Comum Curricular)

Implementa a estrutura hierárquica da BNCC:

**Hierarquia:**

```
CompetenciaGeral (10)
  ↓
CompetenciaEspecifica (por área)
  ↓
Habilidade (codificada, ex: EF67LP08)
  ↓
ObjetoConhecimento (conteúdos)
```

**Características:**

- 10 Competências Gerais completas com dimensões (conhecimentos, habilidades,
  atitudes, valores)
- Habilidades seed exemplares de diferentes etapas e componentes
- Decomposição automática de códigos BNCC (etapa, anos, componente, sequência)
- Validação de formato de códigos

**Uso:**

```typescript
import {
  catalogoBNCC,
  decomposeCodigoHabilidade,
  Etapa,
} from '@/core/domain/bncc';

// Buscar competência geral
const comp = catalogoBNCC.getCompetenciaGeral(2);

// Decompor código de habilidade
const decomp = decomposeCodigoHabilidade('EF67LP08');
// { etapa: Etapa.EF, anos: [6, 7], componente: 'LP', sequencia: 8 }

// Buscar habilidades por filtros
const habilidades = catalogoBNCC.buscarHabilidades({
  etapa: Etapa.EF,
  anos: [6, 7],
  componente: 'LP',
});
```

**Fundamento Teórico:**

- Baseado em BNCC oficial (MEC)
- Teoria das Competências de Perrenoud
- Ver `docs/fundamentos/COMPETENCIA_BNCC.md`

---

### 2. Bloom (Taxonomia Revisada)

Implementa a Taxonomia de Bloom Revisada (Anderson & Krathwohl, 2001):

**Estrutura Bidimensional:**

```
6 Processos Cognitivos × 4 Tipos de Conhecimento = 24 Células
```

**Processos Cognitivos (hierarquia crescente):**

1. **Lembrar** - Recuperar conhecimento da memória
2. **Entender** - Construir significado
3. **Aplicar** - Executar procedimentos
4. **Analisar** - Decompor e relacionar
5. **Avaliar** - Julgar com critérios
6. **Criar** - Reunir elementos em novo todo

**Tipos de Conhecimento:**

- **A - Factual** - Terminologia e fatos
- **B - Conceitual** - Classificações, princípios, teorias
- **C - Procedimental** - Algoritmos, técnicas, métodos
- **D - Metacognitivo** - Conhecimento sobre cognição

**Uso:**

```typescript
import {
  catalogoBloom,
  ProcessoCognitivo,
  TipoConhecimento,
} from '@/core/domain/bloom';

// Buscar célula específica
const celula = catalogoBloom.getCelula(
  ProcessoCognitivo.ANALISAR,
  TipoConhecimento.CONCEITUAL
); // Célula B4

// Identificar processo por verbo
const processo = catalogoBloom.identificarProcessoPorVerbo('comparar');
// ProcessoCognitivo.ANALISAR

// Validar progressão
const { valida, problemas } = catalogoBloom.validarProgressao([
  ProcessoCognitivo.LEMBRAR,
  ProcessoCognitivo.ENTENDER,
  ProcessoCognitivo.CRIAR, // Salto muito grande!
]);
```

**Fundamento Teórico:**

- Anderson, L. W., & Krathwohl, D. R. (2001). _A Taxonomy for Learning,
  Teaching, and Assessing_
- Ver `docs/fundamentos/TAXONOMIA_BLOOM_BNCC.md`

---

### 3. Perrenoud (Teoria das Competências)

Modela a teoria de mobilização de recursos de Philippe Perrenoud:

**Conceitos-Chave:**

- **Competência** - Mobilização de recursos em situações-problema
- **Recursos Cognitivos** - Conhecimentos, habilidades, atitudes, valores
- **Situações-Problema** - Contextos autênticos que exigem mobilização
- **Esquemas de Mobilização** - Padrões de ação cognitiva

**4 Momentos Didáticos:**

1. **Apropriação** - Contato inicial, familiarização
2. **Aplicação Guiada** - Prática com suporte
3. **Análise/Avaliação** - Reflexão sobre prática
4. **Criação** - Transferência e autonomia

**Uso:**

```typescript
import {
  MomentoDidatico,
  type Competencia,
  type SituacaoProblema,
} from '@/core/domain/perrenoud';

// Definir situação-problema
const situacao: SituacaoProblema = {
  id: '...',
  competenciaId: '...',
  contexto: 'Comunidade escolar com problemas ambientais',
  enunciado: 'Desenvolver campanha de conscientização...',
  complexidade: 'complexa',
  abertura: 'aberta',
  momento: 'criacao',
};
```

**Fundamento Teórico:**

- Perrenoud, P. (1999). _Construir as competências desde a escola_
- Ver `docs/fundamentos/COMPETENCIA_BNCC.md`

---

### 4. Virtudes Intelectuais

Implementa 6 virtudes intelectuais core para desenvolvimento do pensamento
crítico:

**Virtudes Core:**

1. **Curiosidade Intelectual** (Epistêmica)
   - Processos Bloom: Analisar, Criar
   - Competência BNCC: 2

2. **Humildade Intelectual** (Moral)
   - Processos Bloom: Avaliar
   - Competências BNCC: 6, 8

3. **Coragem Intelectual** (Prática)
   - Processos Bloom: Avaliar, Criar
   - Competência BNCC: 10

4. **Autonomia Intelectual** (Prática)
   - Processos Bloom: Aplicar, Criar
   - Competência BNCC: 10

5. **Perseverança** (Prática)
   - Processos Bloom: Aplicar, Criar
   - Competência BNCC: 8

6. **Rigor Intelectual** (Epistêmica)
   - Processos Bloom: Analisar, Avaliar
   - Competência BNCC: 7

**Uso:**

```typescript
import {
  catalogoVirtudes,
  CategoriaVirtude,
  ProcessoCognitivo,
} from '@/core/domain/virtudes';

// Listar virtudes por processo Bloom
const virtudes = catalogoVirtudes.listarVirtudesPorProcessoBloom(
  ProcessoCognitivo.CRIAR
); // [Curiosidade, Coragem, Autonomia]

// Listar virtudes por competência BNCC
const virtudesComp = catalogoVirtudes.listarVirtudesPorCompetenciaBNCC(2);
// [Curiosidade Intelectual]
```

---

## Tipos Compartilhados

### Alinhamento Pedagógico

Representa coerência entre BNCC, Bloom e Virtudes:

```typescript
interface AlinhamentoPedagogico {
  habilidadesBNCC: string[]; // Códigos de habilidades
  celulasBloom: string[]; // Códigos de células (A1-D6)
  virtudes: string[]; // Nomes de virtudes
  coerenciaVertical: number; // 0-100 (dentro de cada dimensão)
  coerenciaHorizontal: number; // 0-100 (entre dimensões)
  gaps: string[]; // Lacunas identificadas
  recomendacoes: string[]; // Sugestões de melhoria
}
```

### Hierarquia de Planejamento

5 níveis hierárquicos:

```
ANO (1) → SEMESTRE (2) → BIMESTRE (3) → UNIDADE (4) → AULA (5)
```

### Validações de Coerência

```typescript
interface ValidacaoCoerencia {
  valido: boolean;
  erros: ErroCoerencia[];
  avisos: AvisoCoerencia[];
  score: number; // 0-100
}
```

---

## Princípios de Design

### 1. Imutabilidade

- Todos os tipos são `readonly`
- Repositórios não modificam dados após inicialização
- Funções puras sem side effects

### 2. Separação de Responsabilidades

- Cada agregado tem responsabilidade única
- Tipos compartilhados em `shared/`
- Sem dependências circulares

### 3. Alinhamento Teórico

- Todos os dados seed baseados em fundamentos pedagógicos
- Documentação com referências teóricas
- Mapeamentos rigorosos entre modelos

### 4. Type Safety

- TypeScript strict mode
- Literal types para enums e códigos
- Validação em runtime onde necessário

### 5. Extensibilidade

- Estrutura preparada para dados completos
- Hooks para validações futuras
- Separação clara entre tipos e dados

---

## Próximos Passos

Esta camada de domínio está completa para MVP, mas pode ser expandida:

### Futuras Adições (fora do escopo atual):

1. **Validadores Completos** (`shared/validators.ts`)
   - Validação de hierarquia de planejamento
   - Validação de alinhamento pedagógico
   - Cálculo de coerência vertical/horizontal

2. **Mappers** (`shared/mappers.ts`)
   - Classificação automática de habilidades BNCC em células Bloom
   - Mapeamento de virtudes para habilidades
   - Extração de verbos nucleares

3. **Repositório Perrenoud** (`perrenoud/repository.ts`)
   - Catálogo de competências exemplares
   - Situações-problema seed
   - Esquemas de mobilização

4. **Catálogo BNCC Completo**
   - Todas as habilidades (não apenas exemplares)
   - Competências específicas por área
   - Objetos de conhecimento detalhados

5. **Análise de Progressão**
   - Validadores de progressão cognitiva
   - Análise de densidade de virtudes
   - Recomendações de alinhamento

---

## Consumo por Outras Camadas

### Editor de Planos (Outra Equipe)

```typescript
import {
  catalogoBNCC,
  catalogoBloom,
  catalogoVirtudes
} from '@/core/domain';

// Buscar habilidades para seleção
const habilidades = catalogoBNCC.buscarHabilidades({ ... });

// Classificar habilidade em Bloom
const processo = catalogoBloom.identificarProcessoPorVerbo(verbo);

// Identificar virtudes mobilizadas
const virtudes = catalogoVirtudes.listarVirtudesPorProcessoBloom(processo);
```

### Motor de Análise (Outra Equipe)

```typescript
import type { AlinhamentoPedagogico } from '@/core/domain/shared';

// Analisar alinhamento de plano
function analisarPlano(plano: Plano): AlinhamentoPedagogico {
  // Usar catálogos para validar coerência
}
```

### Store Zustand (Outra Equipe)

```typescript
import type { Habilidade, VirtudeIntelectual } from '@/core/domain';

interface PlannerState {
  habilidadesSelecionadas: Habilidade[];
  virtudesDesenvolver: VirtudeIntelectual[];
  // ...
}
```

---

## Referências

### Fundamentos Pedagógicos

- `docs/fundamentos/COMPETENCIA_BNCC.md`
- `docs/fundamentos/TAXONOMIA_BLOOM_BNCC.md`
- `docs/fundamentos/COMPETENCIAS_BLOOM_TAXONOMIA.md`

### Especificações Técnicas

- `docs/development/SPECS.md` (seções 1.1-1.4, linhas 1637-1868)

### Teoria

- Anderson, L. W., & Krathwohl, D. R. (2001). _A Taxonomy for Learning,
  Teaching, and Assessing_
- Perrenoud, P. (1999). _Construir as competências desde a escola_
- MEC (2018). _Base Nacional Comum Curricular_

---

**Última Atualização:** 2025-10-03 **Responsável:** Equipe de Domínio Pedagógico
**Status:** ✅ Implementação Completa (MVP)

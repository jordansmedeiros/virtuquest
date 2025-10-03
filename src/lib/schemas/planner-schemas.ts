/**
 * Schemas Zod para validação do PlannerEditor
 *
 * Validações rigorosas alinhadas com fundamentos pedagógicos.
 *
 * @module lib/schemas/planner-schemas
 */

import { z } from 'zod';
import { HierarquiaPlanejamento } from '@/core/domain/shared/types';
import { PlanStatus } from '@/core/infrastructure/n8n/types';
import { ProcessoCognitivo } from '@/core/domain/bloom/types';

// ============================================================================
// Schemas Base
// ============================================================================

/**
 * Schema de Metadados do Plano
 */
export const metadadosPlanoSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  titulo: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título não pode exceder 200 caracteres')
    .refine((val) => val.trim().length > 0, 'Título não pode ser vazio'),
  descricao: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(5000, 'Descrição muito extensa'),
  disciplina: z.string().min(1, 'Disciplina é obrigatória'),
  serie: z.string().min(1, 'Série é obrigatória'),
  turma: z.string().min(1, 'Turma é obrigatória'),
  professorId: z.string().uuid('ID de professor inválido'),
  escolaId: z.string().uuid('ID de escola inválido'),
  nivel: z.nativeEnum(HierarquiaPlanejamento),
  status: z.nativeEnum(PlanStatus),
  duracao: z
    .number()
    .int('Duração deve ser um número inteiro')
    .min(10, 'Duração mínima de 10 minutos')
    .max(600, 'Duração máxima de 600 minutos (10 horas)'),
  data: z.coerce.date().refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Data não pode ser no passado',
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  versao: z.number().int().min(1, 'Versão deve ser pelo menos 1'),
  paiId: z.string().uuid().nullable(),
});

// ============================================================================
// Schemas de Recursos e Atividades
// ============================================================================

/**
 * Schema de Recurso Didático
 */
export const recursoDidaticoSchema = z.object({
  id: z.string().uuid(),
  tipo: z.enum(['material', 'tecnologico', 'espacial', 'humano']),
  nome: z.string().min(1, 'Nome do recurso é obrigatório').max(100),
  descricao: z.string().max(500),
  disponibilidade: z.enum(['disponivel', 'solicitar', 'indisponivel']),
  quantidade: z.number().int().positive().optional(),
});

/**
 * Schema de Atividade
 */
export const atividadeSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, 'Nome da atividade é obrigatório').max(200),
  descricao: z
    .string()
    .min(10, 'Descrição da atividade deve ter pelo menos 10 caracteres')
    .max(2000),
  duracao: z.number().int().positive('Duração deve ser um número positivo'),
  tipo: z.enum(['individual', 'grupo', 'coletiva']),
  processosBloom: z
    .array(z.nativeEnum(ProcessoCognitivo))
    .min(1, 'Pelo menos um processo Bloom é obrigatório'),
  recursos: z.array(recursoDidaticoSchema),
  instrucoes: z.string().max(1000),
});

// ============================================================================
// Schema de Momento Didático
// ============================================================================

/**
 * Schema de Momento Didático
 */
export const momentoDidaticoPlanoSchema = z
  .object({
    id: z.string().uuid(),
    ordem: z.number().int().min(0),
    nome: z.string().min(1, 'Nome do momento é obrigatório').max(200),
    tipo: z.enum(['apropriacao', 'aplicacao_guiada', 'analise_avaliacao', 'criacao']),
    duracao: z.number().int().positive('Duração deve ser positiva'),
    atividades: z.array(atividadeSchema).min(1, 'Pelo menos uma atividade é obrigatória'),
    processosBloom: z.array(z.nativeEnum(ProcessoCognitivo)),
    recursos: z.array(recursoDidaticoSchema),
    situacoesProblema: z.array(z.string().uuid()),
    observacoes: z.string().max(1000),
  })
  .refine(
    (data) => {
      // Valida que soma de durações de atividades não excede duração do momento
      const duracaoAtividades = data.atividades.reduce((sum, ativ) => sum + ativ.duracao, 0);
      return duracaoAtividades <= data.duracao;
    },
    {
      message: 'Soma das durações das atividades excede a duração do momento',
      path: ['atividades'],
    }
  );

// ============================================================================
// Schemas de Virtudes
// ============================================================================

/**
 * Schema de Estratégia de Virtude
 */
export const estrategiaVirtudeSchema = z.object({
  virtudeId: z.string().uuid(),
  estrategias: z
    .array(z.string().min(10, 'Estratégia deve ter pelo menos 10 caracteres'))
    .min(1, 'Pelo menos uma estratégia é obrigatória'),
  indicadoresObservaveis: z.array(z.string()),
  momentosTrabalho: z.array(z.number().int().min(0)),
});

// ============================================================================
// Schemas de Avaliação
// ============================================================================

/**
 * Schema de Instrumento Avaliativo
 */
export const instrumentoAvaliativoSchema = z.object({
  id: z.string().uuid(),
  tipo: z.enum(['prova', 'trabalho', 'apresentacao', 'portfolio', 'observacao', 'autoavaliacao']),
  descricao: z.string().min(10).max(1000),
  peso: z.number().int().min(0, 'Peso mínimo é 0').max(100, 'Peso máximo é 100'),
  criterios: z.array(z.string().min(5)),
  processosBloom: z.array(z.nativeEnum(ProcessoCognitivo)),
});

/**
 * Schema de Critério de Avaliação
 */
export const criterioAvaliacaoSchema = z.object({
  id: z.string().uuid(),
  descricao: z.string().min(10).max(500),
  peso: z.number().int().min(0, 'Peso mínimo é 0').max(100, 'Peso máximo é 100'),
  nivelEsperado: z.enum(['inicial', 'intermediario', 'avancado']),
  indicadores: z.array(z.string()),
});

/**
 * Schema de Nível de Rubrica
 */
export const nivelRubricaSchema = z.object({
  nivel: z.string().min(1),
  descricao: z.string().min(10),
  criterios: z.array(z.string()),
});

/**
 * Schema de Rubrica
 */
export const rubricaSchema = z.object({
  id: z.string().uuid(),
  habilidadeId: z.string().min(1, 'ID de habilidade BNCC é obrigatório'),
  niveis: z.array(nivelRubricaSchema).min(3, 'Pelo menos 3 níveis são recomendados'),
  criterios: z.array(criterioAvaliacaoSchema),
});

/**
 * Schema de Avaliação do Plano
 */
export const avaliacaoPlanoSchema = z
  .object({
    tipo: z.enum(['diagnostica', 'formativa', 'somativa']),
    instrumentos: z
      .array(instrumentoAvaliativoSchema)
      .min(1, 'Pelo menos um instrumento avaliativo é obrigatório'),
    criterios: z.array(criterioAvaliacaoSchema),
    rubricas: z.array(rubricaSchema),
  })
  .refine(
    (data) => {
      // Valida que soma dos pesos dos instrumentos é 100
      const somaPesos = data.instrumentos.reduce((sum, instr) => sum + instr.peso, 0);
      return somaPesos === 100;
    },
    {
      message: 'Soma dos pesos dos instrumentos deve ser 100',
      path: ['instrumentos'],
    }
  );

// ============================================================================
// Schema de Matriz Taxonômica
// ============================================================================

/**
 * Validador de código de célula Bloom (ex: 'B4', 'A1')
 */
const codigoCelulaBloomRegex = /^[A-D][1-6]$/;

/**
 * Schema de Matriz Taxonômica
 */
export const matrizTaxonomicaSchema = z.object({
  principal: z.string().regex(codigoCelulaBloomRegex, 'Código de célula inválido (ex: B4)'),
  secundarias: z.array(z.string().regex(codigoCelulaBloomRegex, 'Código de célula inválido')),
  progressao: z
    .array(z.nativeEnum(ProcessoCognitivo))
    .min(1, 'Pelo menos um processo cognitivo é obrigatório'),
});

// ============================================================================
// Schema de Mobilização de Recursos
// ============================================================================

/**
 * Schema de Mobilização de Recursos
 */
export const mobilizacaoRecursosSchema = z.object({
  conhecimentosPrevios: z.array(z.string().uuid()),
  novosRecursos: z.array(z.string().uuid()),
  esquemasMobilizacao: z.array(z.string().uuid()),
});

// ============================================================================
// Schema de Reflexão Metacognitiva
// ============================================================================

/**
 * Schema de Reflexão Metacognitiva
 */
export const reflexaoMetacognitivaSchema = z.object({
  objetivosMetacognitivos: z
    .array(z.string().min(10))
    .min(1, 'Pelo menos um objetivo metacognitivo é recomendado'),
  estrategiasAutoavaliacao: z.array(z.string().min(10)),
  momentosReflexao: z.array(z.number().int().min(0)),
});

// ============================================================================
// Schema de Validação
// ============================================================================

/**
 * Schema de Validação do Plano
 */
export const validacaoPlanoSchema = z.object({
  valido: z.boolean(),
  erros: z.array(z.string()),
  avisos: z.array(z.string()),
  score: z.number().int().min(0, 'Score mínimo é 0').max(100, 'Score máximo é 100'),
});

// ============================================================================
// Schema Principal do Plano
// ============================================================================

/**
 * Schema Completo do Plano de Aula Integrado
 *
 * Validação rigorosa de todos os campos do plano pedagógico.
 */
export const planoAulaIntegradoSchema = z
  .object({
    id: z.string().uuid(),
    metadados: metadadosPlanoSchema,

    // Alinhamento BNCC
    competenciasGerais: z
      .array(z.number().int().min(1).max(10))
      .min(1, 'Pelo menos uma competência geral BNCC é obrigatória'),
    competenciasEspecificas: z.array(z.string().uuid()),
    habilidades: z
      .array(
        z
          .string()
          .regex(
            /^EF\d{2}[A-Z]{2}\d{2}[A-Z]{0,1}$/,
            'Código de habilidade BNCC inválido (ex: EF67LP08)'
          )
      )
      .min(1, 'Pelo menos uma habilidade BNCC é obrigatória'),
    objetosConhecimento: z.array(z.string().uuid()),

    // Análise Bloom
    matrizTaxonomica: matrizTaxonomicaSchema,

    // Virtudes
    virtudesFoco: z.array(z.string().uuid()),
    estrategiasVirtudes: z.array(estrategiaVirtudeSchema),

    // Perrenoud
    situacoesAprendizagem: z.array(z.string().uuid()),
    mobilizacaoRecursos: mobilizacaoRecursosSchema,

    // Sequência Didática
    momentos: z
      .array(momentoDidaticoPlanoSchema)
      .min(1, 'Pelo menos um momento didático é obrigatório'),

    // Avaliação
    avaliacao: avaliacaoPlanoSchema,

    // Metacognição
    reflexaoMetacognitiva: reflexaoMetacognitivaSchema,

    // Validação (gerados pelo sistema, não editados pelo usuário)
    alinhamento: z.any(), // AlinhamentoPedagogico - validado pelo motor
    validacao: validacaoPlanoSchema,
  })
  .refine(
    (data) => {
      // Valida que duração total do plano = soma das durações dos momentos
      const duracaoMomentos = data.momentos.reduce((sum, momento) => sum + momento.duracao, 0);
      return Math.abs(duracaoMomentos - data.metadados.duracao) <= 5; // Tolerância de 5 minutos
    },
    {
      message: 'Duração total do plano deve corresponder à soma dos momentos didáticos',
      path: ['momentos'],
    }
  )
  .refine(
    (data) => {
      // Valida progressão de momentos didáticos (ordem crescente)
      const ordensMomentos = data.momentos.map((m) => m.ordem);
      const ordenadas = [...ordensMomentos].sort((a, b) => a - b);

      return JSON.stringify(ordensMomentos) === JSON.stringify(ordenadas);
    },
    {
      message: 'Momentos didáticos devem estar em ordem crescente',
      path: ['momentos'],
    }
  )
  .refine(
    (data) => {
      // Valida que progressão Bloom não regride
      const ordemProcessos = [
        ProcessoCognitivo.LEMBRAR,
        ProcessoCognitivo.ENTENDER,
        ProcessoCognitivo.APLICAR,
        ProcessoCognitivo.ANALISAR,
        ProcessoCognitivo.AVALIAR,
        ProcessoCognitivo.CRIAR,
      ];

      const progressao = data.matrizTaxonomica.progressao;
      const indices = progressao.map((p) => ordemProcessos.indexOf(p));

      // Verifica se não há regressão (índices devem ser não-decrescentes)
      for (let i = 1; i < indices.length; i++) {
        if (indices[i]! < indices[i - 1]!) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Progressão Bloom não pode regredir (ex: ANALISAR → LEMBRAR)',
      path: ['matrizTaxonomica', 'progressao'],
    }
  );

/**
 * Schema para Criação de Plano (campos opcionais preenchidos com defaults)
 */
export const createPlanoSchema = planoAulaIntegradoSchema.omit({
  id: true,
  alinhamento: true,
  validacao: true,
});

/**
 * Schema para Atualização de Plano (todos os campos opcionais)
 */
export const updatePlanoSchema = planoAulaIntegradoSchema.partial().extend({
  id: z.string().uuid(), // ID é obrigatório para update
});

// ============================================================================
// Mensagens de Erro Customizadas
// ============================================================================

/**
 * Mensagens de erro pedagógicas em português
 */
export const mensagensErro = {
  titulo: {
    curto: 'O título deve ser descritivo e ter pelo menos 3 caracteres.',
    longo: 'O título está muito longo. Seja conciso (máximo 200 caracteres).',
  },
  descricao: {
    curto: 'A descrição deve ser detalhada e ter pelo menos 10 caracteres.',
    vazia: 'A descrição não pode estar vazia.',
  },
  duracao: {
    minima: 'A duração mínima de um plano é 10 minutos. Considere se é viável.',
    maxima: 'A duração máxima é 600 minutos (10 horas). Divida em múltiplos planos se necessário.',
  },
  habilidades: {
    obrigatorio: 'Selecione pelo menos uma habilidade BNCC.',
    formato: 'Código de habilidade inválido. Formato esperado: EF67LP08.',
  },
  bloom: {
    obrigatorio: 'Defina pelo menos um processo cognitivo de Bloom.',
    regressao:
      'A progressão cognitiva está regredindo. Organize do mais simples (LEMBRAR) ao mais complexo (CRIAR).',
  },
  momentos: {
    obrigatorio: 'Defina pelo menos um momento didático.',
    duracao: 'A soma das durações dos momentos deve corresponder à duração total do plano.',
    atividades: 'Cada momento deve ter pelo menos uma atividade definida.',
  },
  avaliacao: {
    instrumentos: 'Defina pelo menos um instrumento avaliativo.',
    pesos: 'A soma dos pesos dos instrumentos deve ser 100.',
  },
};

// ============================================================================
// Exports
// ============================================================================

export type PlanoAulaIntegradoInput = z.infer<typeof planoAulaIntegradoSchema>;
export type CreatePlanoInput = z.infer<typeof createPlanoSchema>;
export type UpdatePlanoInput = z.infer<typeof updatePlanoSchema>;

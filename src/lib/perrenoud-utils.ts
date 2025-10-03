/**
 * Perrenoud Utility Functions and Constants
 */

import type { MomentoDidatico } from '@/core/domain/perrenoud/types';

/**
 * Available moments didáticos (since MomentoDidatico is a type, not enum)
 */
export const MOMENTOS_DIDATICOS: ReadonlyArray<MomentoDidatico> = [
  'apropriacao',
  'aplicacao_guiada',
  'analise_avaliacao',
  'criacao',
] as const;

/**
 * Labels for Momentos Didáticos
 */
export const MOMENTO_LABELS: Record<MomentoDidatico, string> = {
  apropriacao: 'Apropriação',
  aplicacao_guiada: 'Aplicação Guiada',
  analise_avaliacao: 'Análise/Avaliação',
  criacao: 'Criação',
};

/**
 * Descriptions for Momentos Didáticos
 */
export const MOMENTO_DESCRIPTIONS: Record<MomentoDidatico, string> = {
  apropriacao: 'Contato inicial e familiarização com o conceito',
  aplicacao_guiada: 'Prática com suporte e orientação',
  analise_avaliacao: 'Reflexão crítica sobre a prática',
  criacao: 'Transferência autônoma e criação',
};

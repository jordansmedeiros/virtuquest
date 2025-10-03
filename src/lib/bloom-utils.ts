/**
 * Bloom Taxonomy Utility Functions
 *
 * Converts between ProcessoCognitivo (enum) and BloomLevel (string type)
 */

import { ProcessoCognitivo } from '@/core/domain/bloom/types';
import type { BloomLevel } from '@/components/educational/bloom-indicator';

/**
 * Converts ProcessoCognitivo enum to BloomLevel string
 */
export function processoToBloomLevel(processo: ProcessoCognitivo): BloomLevel {
  const map: Record<ProcessoCognitivo, BloomLevel> = {
    [ProcessoCognitivo.LEMBRAR]: 'lembrar',
    [ProcessoCognitivo.ENTENDER]: 'entender',
    [ProcessoCognitivo.APLICAR]: 'aplicar',
    [ProcessoCognitivo.ANALISAR]: 'analisar',
    [ProcessoCognitivo.AVALIAR]: 'avaliar',
    [ProcessoCognitivo.CRIAR]: 'criar',
  };
  return map[processo];
}

/**
 * Converts BloomLevel string to ProcessoCognitivo enum
 */
export function bloomLevelToProcesso(nivel: BloomLevel): ProcessoCognitivo {
  const map: Record<BloomLevel, ProcessoCognitivo> = {
    lembrar: ProcessoCognitivo.LEMBRAR,
    entender: ProcessoCognitivo.ENTENDER,
    aplicar: ProcessoCognitivo.APLICAR,
    analisar: ProcessoCognitivo.ANALISAR,
    avaliar: ProcessoCognitivo.AVALIAR,
    criar: ProcessoCognitivo.CRIAR,
  };
  return map[nivel];
}

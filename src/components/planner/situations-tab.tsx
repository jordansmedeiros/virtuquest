/**
 * SituationsTab - Tab de Situações-Problema do PlannerEditor
 */

'use client';

import { SituationsTimeline } from './situations-timeline';
import { MOMENTOS_DIDATICOS } from '@/lib/perrenoud-utils';
import type { Control, UseFormWatch } from 'react-hook-form';
import type { PlannerFormData } from '@/types/planner';

interface SituationsTabProps {
  control: Control<PlannerFormData>;
  watch: UseFormWatch<PlannerFormData>;
  className?: string;
}

export function SituationsTab({ watch, className }: SituationsTabProps) {
  const situacoesAprendizagem = watch('situacoesAprendizagem') || [];
  const habilidadesBNCC = watch('habilidades') || [];
  const processosBloom = watch('matrizTaxonomica')?.progressao || [];

  const momentos = [...MOMENTOS_DIDATICOS];

  return (
    <div className={className}>
      <SituationsTimeline
        value={situacoesAprendizagem}
        onChange={() => {
          // TODO: Integrar setValue quando tipos estiverem alinhados
        }}
        momentos={momentos}
        habilidadesBNCC={habilidadesBNCC}
        processosBloom={processosBloom}
        allowCustom
      />
    </div>
  );
}

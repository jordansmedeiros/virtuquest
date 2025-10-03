/**
 * VirtuesTab - Tab de Virtudes do PlannerEditor
 */

'use client';

import { VirtuesTracker } from './virtues-tracker';
import type { Control, UseFormWatch } from 'react-hook-form';
import type { PlannerFormData } from '@/types/planner';

interface VirtuesTabProps {
  control: Control<PlannerFormData>;
  watch: UseFormWatch<PlannerFormData>;
  className?: string;
}

export function VirtuesTab({ control, watch, className }: VirtuesTabProps) {
  const virtudesFoco = watch('virtudesFoco') || [];
  const estrategiasVirtudes = watch('estrategiasVirtudes') || [];
  const processosBloom = watch('matrizTaxonomica')?.progressao || [];
  const competenciasGerais = watch('competenciasGerais') || [];

  return (
    <div className={className}>
      <VirtuesTracker
        value={{
          virtudesFoco,
          estrategias: estrategiasVirtudes,
        }}
        onChange={(value) => {
          control.setValue('virtudesFoco', value.virtudesFoco, {
            shouldDirty: true,
          });
          control.setValue('estrategiasVirtudes', value.estrategias, {
            shouldDirty: true,
          });
        }}
        processosBloom={processosBloom}
        competenciasBNCC={competenciasGerais}
        showSuggestions
      />
    </div>
  );
}

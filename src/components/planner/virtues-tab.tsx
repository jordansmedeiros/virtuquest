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
          // TODO: Integrar com react-hook-form
          // control.setValue('virtudesFoco', value.virtudesFoco);
          // control.setValue('estrategiasVirtudes', value.estrategias);
        }}
        processosBloom={processosBloom}
        competenciasBNCC={competenciasGerais}
        showSuggestions
      />
    </div>
  );
}

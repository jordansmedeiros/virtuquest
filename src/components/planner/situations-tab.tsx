/**
 * SituationsTab - Tab de Situações-Problema do PlannerEditor
 */

'use client';

import { SituationsTimeline } from './situations-timeline';
import { MomentoDidatico } from '@/core/domain/perrenoud/types';
import type { Control, UseFormWatch } from 'react-hook-form';
import type { PlannerFormData } from '@/types/planner';

interface SituationsTabProps {
  control: Control<PlannerFormData>;
  watch: UseFormWatch<PlannerFormData>;
  className?: string;
}

export function SituationsTab({ control, watch, className }: SituationsTabProps) {
  const situacoesAprendizagem = watch('situacoesAprendizagem') || [];
  const habilidadesBNCC = watch('habilidades') || [];
  const processosBloom = watch('matrizTaxonomica')?.progressao || [];

  const momentos = [
    MomentoDidatico.APROPRIACAO_RECURSOS,
    MomentoDidatico.APLICACAO_GUIADA,
    MomentoDidatico.ANALISE_AVALIACAO,
    MomentoDidatico.CRIACAO_SOLUCOES,
  ];

  return (
    <div className={className}>
      <SituationsTimeline
        value={situacoesAprendizagem}
        onChange={(value) => {
          control.setValue('situacoesAprendizagem', value, {
            shouldDirty: true,
          });
        }}
        momentos={momentos}
        habilidadesBNCC={habilidadesBNCC}
        processosBloom={processosBloom}
        allowCustom
      />
    </div>
  );
}

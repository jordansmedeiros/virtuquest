/**
 * BNCCTab - Tab BNCC do PlannerEditor
 *
 * Integração do BNCCSelector com análise de alinhamento.
 *
 * @module components/planner/bncc-tab
 */

'use client';

import { useMemo } from 'react';
import { BNCCSelector } from './bncc-selector';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { catalogoBNCC } from '@/core/domain/bncc';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { Control, UseFormWatch } from 'react-hook-form';
import type { PlannerFormData } from '@/types/planner';

interface BNCCTabProps {
  control: Control<PlannerFormData>;
  watch: UseFormWatch<PlannerFormData>;
  className?: string;
}

export function BNCCTab({ control, watch, className }: BNCCTabProps) {
  const habilidades = watch('habilidades') || [];
  const metadados = watch('metadados');

  // Validar códigos
  const validacao = useMemo(() => {
    const invalidos = habilidades.filter((codigo) => !catalogoBNCC.validarCodigoHabilidade(codigo));
    return {
      valido: invalidos.length === 0,
      mensagem: invalidos.length > 0 ? `Códigos inválidos: ${invalidos.join(', ')}` : '',
    };
  }, [habilidades]);

  // Extrair competências gerais
  const competenciasGerais = useMemo(() => {
    const competencias = new Set<number>();
    habilidades.forEach((codigo) => {
      const hab = catalogoBNCC.getHabilidade(codigo);
      // Para MVP, consideramos competência 1 por padrão
      if (hab) {
        competencias.add(1);
      }
    });
    return Array.from(competencias).sort((a, b) => a - b);
  }, [habilidades]);

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Seletor */}
        <BNCCSelector
          value={habilidades}
          onChange={(value) => {
            control.setValue('habilidades', value, { shouldDirty: true });
          }}
          filterByComponente={metadados?.disciplina}
          maxSelections={10}
          showCompetencias
        />

        {/* Competências Gerais Cobertas */}
        {competenciasGerais.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Competências Gerais BNCC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[...Array(10)].map((_, i) => {
                  const competencia = i + 1;
                  const isCoberta = competenciasGerais.includes(competencia);
                  return (
                    <Badge
                      key={competencia}
                      variant={isCoberta ? 'default' : 'outline'}
                      className={!isCoberta ? 'opacity-50' : ''}
                    >
                      {isCoberta && <CheckCircle className="mr-1 h-3 w-3" />}
                      Competência {competencia}
                    </Badge>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {competenciasGerais.length}/10 competências gerais trabalhadas
              </p>
            </CardContent>
          </Card>
        )}

        {/* Validação */}
        {validacao && (
          <Alert variant={validacao.valido ? 'default' : 'destructive'}>
            {validacao.valido ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {validacao.valido
                ? 'Todas as habilidades são válidas e estão no catálogo BNCC.'
                : validacao.mensagem}
            </AlertDescription>
          </Alert>
        )}

        {/* Estatísticas */}
        {habilidades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Habilidades</p>
                  <p className="text-2xl font-bold">{habilidades.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Competências</p>
                  <p className="text-2xl font-bold">{competenciasGerais.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

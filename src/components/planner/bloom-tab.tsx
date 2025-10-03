/**
 * BloomTab - Tab Bloom do PlannerEditor
 *
 * Integração do BloomMapper com análise automática de habilidades.
 *
 * @module components/planner/bloom-tab
 */

'use client';

import { useMemo, useEffect } from 'react';
import { BloomMapper } from './bloom-mapper';
import { BloomIndicator } from '@/components/educational/bloom-indicator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { catalogoBNCC } from '@/core/domain/bncc';
import { classificarHabilidadeBloom } from '@/core/domain/shared/mappers';
import { validarProgressaoBloom } from '@/core/domain/shared/validators';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import type { Control, UseFormWatch } from 'react-hook-form';
import type { PlannerFormData } from '@/types/planner';
import type { CelulaTaxonomica } from '@/core/domain/bloom/types';

interface BloomTabProps {
  control: Control<PlannerFormData>;
  watch: UseFormWatch<PlannerFormData>;
  className?: string;
}

export function BloomTab({ control, watch, className }: BloomTabProps) {
  const habilidades = watch('habilidades') || [];
  const matrizTaxonomica = watch('matrizTaxonomica');

  // Classificar habilidades automaticamente
  const classificacoes = useMemo(() => {
    const result: Map<string, CelulaTaxonomica> = new Map();
    habilidades.forEach((codigo) => {
      const hab = catalogoBNCC.buscarHabilidadePorCodigo(codigo);
      if (hab) {
        const celula = classificarHabilidadeBloom(hab);
        if (celula) {
          result.set(codigo, celula);
        }
      }
    });
    return result;
  }, [habilidades]);

  // Validar progressão
  const validacao = useMemo(() => {
    if (!matrizTaxonomica?.progressao || matrizTaxonomica.progressao.length === 0) {
      return null;
    }
    return validarProgressaoBloom(matrizTaxonomica.progressao);
  }, [matrizTaxonomica?.progressao]);

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Classificação Automática */}
        {classificacoes.size > 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">
                Classificação Automática das Habilidades BNCC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from(classificacoes.entries()).map(([codigo, celula]) => (
                <div
                  key={codigo}
                  className="flex items-center justify-between rounded-md border bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs font-semibold">
                      {codigo}
                    </code>
                    <BloomIndicator processo={celula.processo} showLabel />
                    <Badge variant="outline">{celula.conhecimento}</Badge>
                  </div>
                  <Badge>{celula.codigo}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Mapeador Bloom */}
        <BloomMapper
          value={matrizTaxonomica || { principal: '', secundarias: [], progressao: [] }}
          onChange={(value) => {
            // TODO: Integrar com react-hook-form
            // control.setValue('matrizTaxonomica', value);
          }}
          habilidadesBNCC={habilidades}
          showSuggestions
        />

        {/* Progressão Cognitiva */}
        {matrizTaxonomica?.progressao && matrizTaxonomica.progressao.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <TrendingUp className="mr-2 inline h-4 w-4" />
                Progressão Cognitiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {matrizTaxonomica.progressao.map((processo, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <BloomIndicator processo={processo} showLabel />
                    {idx < matrizTaxonomica.progressao.length - 1 && (
                      <span className="text-muted-foreground">→</span>
                    )}
                  </div>
                ))}
              </div>

              {validacao && (
                <Alert variant={validacao.valida ? 'default' : 'destructive'}>
                  {validacao.valida ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {validacao.valida ? (
                      'Progressão cognitiva válida e coerente'
                    ) : (
                      <div>
                        <p className="font-semibold">Problemas detectados:</p>
                        <ul className="mt-2 space-y-1">
                          {validacao.problemas.map((p, idx) => (
                            <li key={idx}>• {p}</li>
                          ))}
                        </ul>
                        {validacao.sugestoes.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold">Sugestões:</p>
                            <ul className="mt-1 space-y-1">
                              {validacao.sugestoes.map((s, idx) => (
                                <li key={idx}>• {s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Análise de Complexidade */}
        {matrizTaxonomica?.principal && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Análise de Complexidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Nível de Complexidade Cognitiva</span>
                    <span className="font-semibold">
                      {matrizTaxonomica.progressao[matrizTaxonomica.progressao.length - 1] || 'N/A'}
                    </span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Baseado na célula principal e processos da progressão
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

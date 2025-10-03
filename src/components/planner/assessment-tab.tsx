/**
 * AssessmentTab - Tab de Avaliação do PlannerEditor
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertCircle } from 'lucide-react';
import type { Control, UseFormWatch } from 'react-hook-form';
import type { PlannerFormData } from '@/types/planner';

interface AssessmentTabProps {
  control: Control<PlannerFormData>;
  watch: UseFormWatch<PlannerFormData>;
  className?: string;
}

export function AssessmentTab({ control, watch, className }: AssessmentTabProps) {
  const avaliacao = watch('avaliacao');

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Tipo de Avaliação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tipo de Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer">
                Diagnóstica
              </Badge>
              <Badge variant="default" className="cursor-pointer">
                Formativa
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Somativa
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Instrumentos Avaliativos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Instrumentos Avaliativos</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!avaliacao?.instrumentos || avaliacao.instrumentos.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Nenhum instrumento avaliativo definido. Adicione pelo menos um instrumento.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {/* TODO: Listar instrumentos */}
                <p className="text-sm text-muted-foreground">Instrumentos em desenvolvimento</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critérios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Critérios de Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Defina critérios claros e mensuráveis para avaliar o aprendizado
            </p>
          </CardContent>
        </Card>

        {/* Rubricas (Preparação para geração automática) */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Rubricas (IA)</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Rubricas serão geradas automaticamente pelo motor de IA com base nas habilidades
                BNCC e critérios definidos. (Funcionalidade futura)
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

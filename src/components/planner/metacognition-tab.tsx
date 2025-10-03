/**
 * MetacognitionTab - Tab de Metacognição do PlannerEditor
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Lightbulb, Brain } from 'lucide-react';
import type { UseFormWatch } from 'react-hook-form';
import type { PlannerFormData } from '@/types/planner';

interface MetacognitionTabProps {
  watch: UseFormWatch<PlannerFormData>;
  className?: string;
}

export function MetacognitionTab({ watch, className }: MetacognitionTabProps) {
  const reflexao = watch('reflexaoMetacognitiva');
  const momentos = watch('momentos') || [];

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Introdução */}
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            A metacognição promove a consciência dos alunos sobre seu próprio processo de
            aprendizagem, desenvolvendo autonomia e autorregulação.
          </AlertDescription>
        </Alert>

        {/* Objetivos Metacognitivos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                <Lightbulb className="mr-2 inline h-4 w-4" />
                Objetivos Metacognitivos
              </CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              O que os alunos devem refletir sobre seu aprendizado?
            </p>
            <Textarea
              placeholder="Ex: Identificar suas estratégias de estudo mais eficazes..."
              rows={3}
            />
            {reflexao?.objetivosMetacognitivos && reflexao.objetivosMetacognitivos.length > 0 && (
              <div className="space-y-2">
                {reflexao.objetivosMetacognitivos.map((obj, idx) => (
                  <div key={idx} className="rounded-md border p-3">
                    <p className="text-sm">{obj}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estratégias de Autoavaliação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estratégias de Autoavaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="diario" />
                <label htmlFor="diario" className="text-sm">
                  Diário de aprendizagem
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="portfolio" />
                <label htmlFor="portfolio" className="text-sm">
                  Portfólio reflexivo
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="rubrica" />
                <label htmlFor="rubrica" className="text-sm">
                  Rubrica de autoavaliação
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="perguntas" />
                <label htmlFor="perguntas" className="text-sm">
                  Perguntas-guia metacognitivas
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Momentos de Reflexão */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Momentos de Reflexão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Em quais momentos didáticos haverá reflexão metacognitiva?
            </p>
            <div className="space-y-2">
              {momentos.map((momento, idx) => (
                <div key={momento.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`momento-${idx}`}
                    checked={reflexao?.momentosReflexao?.includes(idx)}
                  />
                  <label htmlFor={`momento-${idx}`} className="text-sm">
                    {momento.nome || `Momento ${idx + 1}`}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sugestões */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm">Perguntas-Guia Sugeridas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• O que aprendi hoje?</li>
              <li>• Como aprendi (quais estratégias funcionaram)?</li>
              <li>• O que ainda preciso melhorar?</li>
              <li>• Como posso aplicar isso em outras situações?</li>
              <li>• Quais dificuldades encontrei e como as superei?</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

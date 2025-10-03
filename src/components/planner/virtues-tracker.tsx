/**
 * VirtuesTracker - Rastreamento de virtudes intelectuais
 *
 * Componente para seleção de virtudes intelectuais e
 * definição de estratégias pedagógicas para seu desenvolvimento.
 *
 * @module components/planner/virtues-tracker
 */

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { catalogoVirtudes } from '@/core/domain/virtudes';
import { mapearVirtudesProcesso } from '@/core/domain/shared/mappers';
import type { VirtuesTrackerProps, EstrategiaVirtude } from '@/types/planner';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Grid3x3,
  List as ListIcon,
} from 'lucide-react';

/**
 * VirtuesTracker Component
 *
 * Gerencia seleção de virtudes intelectuais e estratégias
 * de desenvolvimento pedagógico.
 */
export function VirtuesTracker({
  value,
  onChange,
  processosBloom,
  competenciasBNCC,
  showSuggestions = false,
  className,
}: VirtuesTrackerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingVirtude, setEditingVirtude] = useState<string | null>(null);
  const [novaEstrategia, setNovaEstrategia] = useState('');

  // Buscar todas as virtudes
  const todasVirtudes = catalogoVirtudes.listarVirtudes();

  // Gerar sugestões baseadas em processos Bloom
  const sugestoesBloom =
    showSuggestions && processosBloom.length > 0
      ? processosBloom.flatMap((processo) => mapearVirtudesProcesso(processo))
      : [];

  // Remover duplicatas
  const sugestoesUnicas = Array.from(new Set(sugestoesBloom.map((v) => v.nome))).map(
    (nome) => sugestoesBloom.find((v) => v.nome === nome)!
  );

  // Toggle virtude
  const toggleVirtude = (virtudeId: string) => {
    if (value.virtudesFoco.includes(virtudeId)) {
      // Remover virtude e suas estratégias
      onChange({
        virtudesFoco: value.virtudesFoco.filter((id) => id !== virtudeId),
        estrategias: value.estrategias.filter((e) => e.virtudeId !== virtudeId),
      });
    } else {
      // Adicionar virtude
      onChange({
        ...value,
        virtudesFoco: [...value.virtudesFoco, virtudeId],
      });
    }
  };

  // Adicionar estratégia
  const adicionarEstrategia = (virtudeId: string) => {
    if (!novaEstrategia.trim()) return;

    const estrategiaExistente = value.estrategias.find((e) => e.virtudeId === virtudeId);

    if (estrategiaExistente) {
      // Atualizar estratégia existente
      onChange({
        ...value,
        estrategias: value.estrategias.map((e) =>
          e.virtudeId === virtudeId
            ? {
                ...e,
                estrategias: [...e.estrategias, novaEstrategia],
              }
            : e
        ),
      });
    } else {
      // Criar nova estratégia
      const novaEst: EstrategiaVirtude = {
        virtudeId,
        estrategias: [novaEstrategia],
        indicadoresObservaveis: [],
        momentosTrabalho: [],
      };
      onChange({
        ...value,
        estrategias: [...value.estrategias, novaEst],
      });
    }

    setNovaEstrategia('');
  };

  // Remover estratégia
  const removerEstrategia = (virtudeId: string, index: number) => {
    onChange({
      ...value,
      estrategias: value.estrategias.map((e) =>
        e.virtudeId === virtudeId
          ? {
              ...e,
              estrategias: e.estrategias.filter((_, i) => i !== index),
            }
          : e
      ),
    });
  };

  // Verificar compatibilidade com Bloom
  const getCompatibilidade = (virtudeId: string) => {
    const virtude = todasVirtudes.find((v) => v.nome === virtudeId);
    if (!virtude || processosBloom.length === 0) return 'neutro';

    // Lógica simplificada - pode ser expandida
    const compativel = sugestoesUnicas.some((v) => v.nome === virtude.nome);
    return compativel ? 'alta' : 'baixa';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="mr-2 h-4 w-4" />
            Grade
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="mr-2 h-4 w-4" />
            Lista
          </Button>
        </div>

        <Badge variant="secondary">{value.virtudesFoco.length} virtude(s) selecionada(s)</Badge>
      </div>

      {/* Sugestões */}
      {showSuggestions && sugestoesUnicas.length > 0 && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold">Virtudes Recomendadas:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sugestoesUnicas.slice(0, 4).map((virtude) => (
                <Badge
                  key={virtude.nome}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => toggleVirtude(virtude.nome)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {virtude.nome}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Grid de Virtudes */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {todasVirtudes.map((virtude) => {
            const isSelected = value.virtudesFoco.includes(virtude.nome);
            const compatibilidade = getCompatibilidade(virtude.nome);
            const estrategia = value.estrategias.find((e) => e.virtudeId === virtude.nome);

            return (
              <Card
                key={virtude.nome}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  isSelected && 'border-primary bg-primary/5'
                )}
                onClick={() => toggleVirtude(virtude.nome)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Checkbox checked={isSelected} className="mt-1" />
                    <Badge
                      variant={
                        compatibilidade === 'alta'
                          ? 'default'
                          : compatibilidade === 'baixa'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="text-xs"
                    >
                      {compatibilidade === 'alta'
                        ? '✓ Compatível'
                        : compatibilidade === 'baixa'
                          ? 'Pouco compatível'
                          : 'Neutro'}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-base">{virtude.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{virtude.descricao}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {virtude.categoria}
                    </Badge>
                    {estrategia && estrategia.estrategias.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {estrategia.estrategias.length} estratégia(s)
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lista de Virtudes */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {todasVirtudes.map((virtude) => {
            const isSelected = value.virtudesFoco.includes(virtude.nome);
            const compatibilidade = getCompatibilidade(virtude.nome);

            return (
              <div
                key={virtude.nome}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                  isSelected && 'border-primary bg-primary/5',
                  'hover:bg-muted/50'
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleVirtude(virtude.nome)}
                />
                <div className="flex-1">
                  <div className="font-semibold">{virtude.nome}</div>
                  <p className="text-sm text-muted-foreground">{virtude.descricao}</p>
                </div>
                <Badge variant="outline">{virtude.categoria}</Badge>
                <Badge
                  variant={
                    compatibilidade === 'alta'
                      ? 'default'
                      : compatibilidade === 'baixa'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {compatibilidade}
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      {/* Estratégias Detalhadas */}
      {value.virtudesFoco.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <Lightbulb className="mr-2 inline h-4 w-4" />
              Estratégias de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {value.virtudesFoco.map((virtudeId) => {
                const virtude = todasVirtudes.find((v) => v.nome === virtudeId);
                const estrategia = value.estrategias.find((e) => e.virtudeId === virtudeId);

                if (!virtude) return null;

                return (
                  <AccordionItem key={virtudeId} value={virtudeId}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>{virtude.nome}</span>
                        {estrategia && estrategia.estrategias.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {estrategia.estrategias.length}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {/* Estratégias Existentes */}
                        {estrategia && estrategia.estrategias.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Estratégias definidas:</p>
                            {estrategia.estrategias.map((est, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 rounded-md border p-2"
                              >
                                <p className="flex-1 text-sm">{est}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removerEstrategia(virtudeId, idx)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Adicionar Nova Estratégia */}
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Adicionar estratégia:</p>
                          <div className="flex gap-2">
                            <Textarea
                              value={editingVirtude === virtudeId ? novaEstrategia : ''}
                              onChange={(e) => {
                                setEditingVirtude(virtudeId);
                                setNovaEstrategia(e.target.value);
                              }}
                              placeholder="Descreva uma ação pedagógica para desenvolver esta virtude..."
                              className="min-h-[60px]"
                            />
                            <Button
                              onClick={() => adicionarEstrategia(virtudeId)}
                              disabled={!novaEstrategia.trim()}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Indicadores Sugeridos */}
                        {virtude.indicadores && virtude.indicadores.length > 0 && (
                          <div className="rounded-md bg-muted/50 p-3">
                            <p className="text-sm font-semibold">
                              Indicadores observáveis sugeridos:
                            </p>
                            <ul className="mt-2 space-y-1 text-sm">
                              {virtude.indicadores.slice(0, 3).map((ind, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-muted-foreground">•</span>
                                  <span>{ind}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Validação */}
      {value.virtudesFoco.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhuma virtude selecionada. Recomenda-se trabalhar pelo menos 2-3 virtudes intelectuais
            por plano.
          </AlertDescription>
        </Alert>
      )}

      {value.virtudesFoco.some(
        (id) => !value.estrategias.find((e) => e.virtudeId === id)?.estrategias.length
      ) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Algumas virtudes não possuem estratégias definidas. Defina pelo menos uma estratégia
            para cada virtude selecionada.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

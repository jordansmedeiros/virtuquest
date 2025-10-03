/**
 * SituationsTimeline - Timeline de situações-problema com drag-and-drop
 *
 * Componente para gerenciar e ordenar situações-problema
 * pelos 4 momentos didáticos de Perrenoud.
 *
 * @module components/planner/situations-timeline
 */

'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { catalogoPerrenoud } from '@/core/domain/perrenoud';
import type { SituationsTimelineProps } from '@/types/planner';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Trash2, AlertCircle, Lightbulb } from 'lucide-react';

/**
 * Item Arrastável de Situação
 */
function SortableSituationItem({ situacao, onRemove }: { situacao: any; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: situacao.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{situacao.momento}</Badge>
            <Badge
              variant={
                situacao.complexidade === 'simples'
                  ? 'secondary'
                  : situacao.complexidade === 'intermediaria'
                    ? 'default'
                    : 'destructive'
              }
            >
              {situacao.complexidade}
            </Badge>
          </div>

          <h4 className="font-semibold">{situacao.contexto}</h4>
          <p className="line-clamp-2 text-sm text-muted-foreground">{situacao.enunciado}</p>

          {situacao.processosBloom && situacao.processosBloom.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {situacao.processosBloom.slice(0, 3).map((processo: string) => (
                <Badge key={processo} variant="outline" className="text-xs">
                  {processo}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

/**
 * SituationsTimeline Component
 *
 * Timeline interativa com drag-and-drop para ordenação de
 * situações-problema segundo momentos de Perrenoud.
 */
export function SituationsTimeline({ value, onChange, className }: SituationsTimelineProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [groupByMomento, setGroupByMomento] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Hidratar situações do catálogo
  const situacoes = value
    .map((id) => catalogoPerrenoud.getSituacaoProblema(id))
    .filter((s) => s !== null);

  // Agrupar por momento
  const situacoesPorMomento = groupByMomento
    ? {
        apropriacao: situacoes.filter((s) => s?.momento === 'apropriacao'),
        aplicacao_guiada: situacoes.filter((s) => s?.momento === 'aplicacao_guiada'),
        analise_avaliacao: situacoes.filter((s) => s?.momento === 'analise_avaliacao'),
        criacao: situacoes.filter((s) => s?.momento === 'criacao'),
      }
    : null;

  // Handler de drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = value.indexOf(active.id as string);
    const newIndex = value.indexOf(over.id as string);

    const newOrder = arrayMove(value, oldIndex, newIndex);
    onChange(newOrder);
  };

  // Remover situação
  const removerSituacao = (id: string) => {
    onChange(value.filter((sid) => sid !== id));
  };

  // Sugestões (mock - seria integrado com catálogo)
  const sugestoes: any[] = [];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={groupByMomento ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroupByMomento(true)}
          >
            Por Momento
          </Button>
          <Button
            variant={!groupByMomento ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroupByMomento(false)}
          >
            Lista Simples
          </Button>
        </div>

        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Situação
        </Button>
      </div>

      {/* Sugestões */}
      {sugestoes.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              <Lightbulb className="mr-2 inline h-4 w-4" />
              Situações Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Baseado nas habilidades BNCC selecionadas...
            </p>
          </CardContent>
        </Card>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* Visualização por Momento */}
        {groupByMomento && situacoesPorMomento && (
          <div className="space-y-6">
            {Object.entries(situacoesPorMomento).map(([momento, sits]) => (
              <Card key={momento}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{momento.replace(/_/g, ' ')}</CardTitle>
                    <Badge variant="secondary">{sits.length} situação(ões)</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {sits.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      Nenhuma situação neste momento
                    </div>
                  ) : (
                    <SortableContext
                      items={sits.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {sits.map((situacao) => (
                          <SortableSituationItem
                            key={situacao.id}
                            situacao={situacao}
                            onRemove={() => removerSituacao(situacao.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Visualização Lista Simples */}
        {!groupByMomento && (
          <Card>
            <CardHeader>
              <CardTitle>Todas as Situações ({situacoes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {situacoes.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  Nenhuma situação adicionada
                </div>
              ) : (
                <SortableContext
                  items={situacoes.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {situacoes.map((situacao) => (
                      <SortableSituationItem
                        key={situacao.id}
                        situacao={situacao}
                        onRemove={() => removerSituacao(situacao.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </CardContent>
          </Card>
        )}
      </DndContext>

      {/* Dialog de Adicionar */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Situação-Problema</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecione uma situação do catálogo ou crie uma customizada.
            </p>
            {/* TODO: Implementar seleção do catálogo */}
            <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
              Seleção de situações do catálogo em desenvolvimento
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Validação */}
      {value.length === 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div className="text-sm">
                <p className="font-semibold">Nenhuma situação-problema definida</p>
                <p className="mt-1 text-muted-foreground">
                  Recomenda-se incluir pelo menos uma situação-problema para contextualizar a
                  aprendizagem.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

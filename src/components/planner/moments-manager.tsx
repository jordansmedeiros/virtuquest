/**
 * MomentsManager - Gerenciador de momentos didáticos
 *
 * Componente para criar e organizar momentos didáticos com
 * drag-and-drop, atividades e recursos.
 *
 * @module components/planner/moments-manager
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BloomIndicator } from '@/components/educational/bloom-indicator';
import { MomentoDidatico } from '@/core/domain/perrenoud/types';
import type { MomentsManagerProps, MomentoDidaticoPlano } from '@/types/planner';
import { cn } from '@/lib/utils';
import {
  GripVertical,
  Plus,
  Trash2,
  Clock,
  Package,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

/**
 * Item Arrastável de Momento
 */
function SortableMomentItem({
  momento,
  duracaoTotal,
  onEdit,
  onRemove,
}: {
  momento: MomentoDidaticoPlano;
  duracaoTotal: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: momento.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const percentualDuracao = (momento.duracao / duracaoTotal) * 100;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none pt-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5" />
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{momento.tipo.replace(/_/g, ' ')}</Badge>
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {momento.duracao} min
                </Badge>
                <Badge variant="outline">{momento.atividades.length} atividade(s)</Badge>
              </div>
              <CardTitle className="mt-2 text-base">{momento.nome}</CardTitle>

              {/* Barra de Progresso */}
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentualDuracao}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {percentualDuracao.toFixed(1)}% da duração total
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={onRemove}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4 border-t pt-4">
            {/* Atividades */}
            {momento.atividades.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Atividades:</h4>
                {momento.atividades.map((atividade) => (
                  <div key={atividade.id} className="rounded-md border bg-muted/50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{atividade.nome}</span>
                      <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        {atividade.duracao} min
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{atividade.descricao}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Processos Bloom */}
            {momento.processosBloom.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">Processos Bloom:</h4>
                <div className="flex flex-wrap gap-2">
                  {momento.processosBloom.map((processo) => (
                    <BloomIndicator key={processo} processo={processo} />
                  ))}
                </div>
              </div>
            )}

            {/* Recursos */}
            {momento.recursos.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">
                  <Package className="mr-1 inline h-4 w-4" />
                  Recursos:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {momento.recursos.map((recurso) => (
                    <Badge key={recurso.id} variant="outline">
                      {recurso.nome}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Observações */}
            {momento.observacoes && (
              <div className="rounded-md bg-muted/50 p-3">
                <h4 className="text-sm font-semibold">Observações:</h4>
                <p className="mt-1 text-sm text-muted-foreground">{momento.observacoes}</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

/**
 * MomentsManager Component
 *
 * Gerenciador completo de momentos didáticos com drag-and-drop,
 * validação de duração e progressão pedagógica.
 */
export function MomentsManager({
  value,
  onChange,
  duracaoTotal,
  situacoesDisponiveis,
  className,
}: MomentsManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMomento, setEditingMomento] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calcular duração total dos momentos
  const duracaoMomentos = value.reduce((sum, m) => sum + m.duracao, 0);
  const diferenca = duracaoMomentos - duracaoTotal;
  const isDuracaoValida = Math.abs(diferenca) <= 5; // Tolerância de 5 minutos

  // Handler de drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = value.findIndex((m) => m.id === active.id);
    const newIndex = value.findIndex((m) => m.id === over.id);

    const newOrder = arrayMove(value, oldIndex, newIndex).map((m, idx) => ({
      ...m,
      ordem: idx,
    }));

    onChange(newOrder);
  };

  // Remover momento
  const removerMomento = (id: string) => {
    onChange(value.filter((m) => m.id !== id));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Momentos Didáticos</h3>
          <p className="text-sm text-muted-foreground">
            {value.length} momento(s) • {duracaoMomentos} minutos
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Momento
        </Button>
      </div>

      {/* Validação de Duração */}
      {!isDuracaoValida && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="text-sm">
                <p className="font-semibold">Duração inconsistente</p>
                <p className="mt-1 text-muted-foreground">
                  A soma dos momentos ({duracaoMomentos} min) difere da duração total do plano (
                  {duracaoTotal} min).
                  {diferenca > 0
                    ? ` Reduza ${diferenca} minutos.`
                    : ` Adicione ${Math.abs(diferenca)} minutos.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Momentos com Drag-and-Drop */}
      {value.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Nenhum momento didático definido</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Momento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {value.map((momento) => (
                <SortableMomentItem
                  key={momento.id}
                  momento={momento}
                  duracaoTotal={duracaoTotal}
                  onEdit={() => setEditingMomento(momento.id)}
                  onRemove={() => removerMomento(momento.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total de Momentos</p>
              <p className="text-2xl font-bold">{value.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duração Total</p>
              <p className="text-2xl font-bold">{duracaoMomentos} min</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total de Atividades</p>
              <p className="text-2xl font-bold">
                {value.reduce((sum, m) => sum + m.atividades.length, 0)}
              </p>
            </div>
          </div>

          {/* Distribuição por Tipo */}
          <div>
            <p className="mb-2 text-sm font-semibold">Distribuição por Tipo:</p>
            <div className="space-y-1">
              {Object.values(MomentoDidatico).map((tipo) => {
                const momentos = value.filter((m) => m.tipo === tipo);
                const duracao = momentos.reduce((s, m) => s + m.duracao, 0);
                const percentual = duracaoTotal > 0 ? (duracao / duracaoTotal) * 100 : 0;

                return (
                  <div key={tipo} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{tipo.replace(/_/g, ' ')}</span>
                        <span className="text-muted-foreground">
                          {duracao} min ({percentual.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${percentual}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Adicionar/Editar */}
      <Dialog
        open={isAddDialogOpen || editingMomento !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingMomento(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMomento ? 'Editar Momento' : 'Adicionar Momento'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Formulário de criação/edição de momento em desenvolvimento
            </p>
            {/* TODO: Implementar formulário completo */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

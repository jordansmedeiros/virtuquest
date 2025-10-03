/**
 * BNCCSelector - Componente para seleção de competências e habilidades BNCC
 *
 * Permite busca, filtro e seleção múltipla de habilidades da BNCC
 * com validação pedagógica e sugestões inteligentes.
 *
 * @module components/planner/bncc-selector
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BNCCBadge } from '@/components/educational/bncc-badge';
import { catalogoBNCC } from '@/core/domain/bncc';
import type { Habilidade } from '@/core/domain/bncc/types';
import type { BNCCSelectorProps } from '@/types/planner';
import { Search, Check, X, ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * BNCCSelector Component
 *
 * Componente interativo para seleção de habilidades BNCC com busca,
 * filtros e validação pedagógica.
 *
 * @example
 * ```tsx
 * <BNCCSelector
 *   value={['EF67LP08', 'EF67LP09']}
 *   onChange={(habilidades) => setHabilidades(habilidades)}
 *   filterByComponente="Língua Portuguesa"
 *   filterByAno={6}
 *   maxSelections={10}
 * />
 * ```
 */
export function BNCCSelector({
  value,
  onChange,
  maxSelections = 10,
  filterByComponente,
  filterByAno,
  showCompetencias = false,
  className,
}: BNCCSelectorProps) {
  // Estado local
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'competencias' | 'habilidades'>('habilidades');
  const [expandedCompetencias, setExpandedCompetencias] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  // Obter todas as habilidades do catálogo
  const todasHabilidades = useMemo(() => {
    return catalogoBNCC.listarTodasHabilidades();
  }, []);

  // Filtrar habilidades baseado em busca e filtros
  const filteredHabilidades = useMemo(() => {
    let filtered = todasHabilidades;

    // Filtro por componente curricular
    if (filterByComponente) {
      filtered = filtered.filter((h) => h.componenteCurricular === filterByComponente);
    }

    // Filtro por ano
    if (filterByAno) {
      filtered = filtered.filter((h) => h.ano === filterByAno);
    }

    // Busca textual
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) => h.codigo.toLowerCase().includes(query) || h.descricao.toLowerCase().includes(query)
      );
    }

    // Ordenar por relevância (matches exatos primeiro)
    return filtered
      .sort((a, b) => {
        if (searchQuery) {
          const aExact = a.codigo.toLowerCase() === searchQuery.toLowerCase();
          const bExact = b.codigo.toLowerCase() === searchQuery.toLowerCase();
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
        }
        return a.codigo.localeCompare(b.codigo);
      })
      .slice(0, 50); // Limitar para performance
  }, [todasHabilidades, filterByComponente, filterByAno, searchQuery]);

  // Habilidades selecionadas (objetos completos)
  const habilidadesSelecionadas = useMemo(() => {
    return value
      .map((codigo) => catalogoBNCC.buscarHabilidadePorCodigo(codigo))
      .filter((h): h is Habilidade => h !== null);
  }, [value]);

  // Handler para adicionar/remover habilidade
  const toggleHabilidade = (codigo: string) => {
    if (value.includes(codigo)) {
      onChange(value.filter((c) => c !== codigo));
    } else {
      if (value.length >= maxSelections) {
        // TODO: Exibir toast de limite atingido
        return;
      }
      onChange([...value, codigo]);
    }
  };

  // Handler para limpar seleção
  const clearSelection = () => {
    onChange([]);
  };

  // Verificar se está no limite
  const isAtLimit = value.length >= maxSelections;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Contador e Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {value.length}/{maxSelections} selecionadas
          </span>
          {isAtLimit && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="mr-1 h-3 w-3" />
              Limite atingido
            </Badge>
          )}
        </div>
        {value.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearSelection} className="h-8">
            <X className="mr-2 h-4 w-4" />
            Limpar seleção
          </Button>
        )}
      </div>

      {/* Habilidades Selecionadas */}
      {habilidadesSelecionadas.length > 0 && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <h4 className="mb-3 text-sm font-semibold">Habilidades Selecionadas</h4>
          <div className="flex flex-wrap gap-2">
            {habilidadesSelecionadas.map((habilidade) => (
              <div key={habilidade.codigo} className="group relative inline-flex items-center">
                <BNCCBadge codigo={habilidade.codigo} showTooltip />
                <button
                  onClick={() => toggleHabilidade(habilidade.codigo)}
                  className="ml-1 rounded-full bg-destructive/10 p-0.5 opacity-0 transition-opacity hover:bg-destructive/20 group-hover:opacity-100"
                  aria-label={`Remover ${habilidade.codigo}`}
                >
                  <X className="h-3 w-3 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Tabs: Habilidades vs Competências */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
          {showCompetencias && <TabsTrigger value="competencias">Competências</TabsTrigger>}
        </TabsList>

        {/* Tab de Habilidades */}
        <TabsContent value="habilidades" className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por código ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Lista de Habilidades */}
          <div className="max-h-[400px] space-y-2 overflow-y-auto rounded-md border p-4">
            {filteredHabilidades.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                Nenhuma habilidade encontrada
              </div>
            ) : (
              filteredHabilidades.map((habilidade) => {
                const isSelected = value.includes(habilidade.codigo);
                const canSelect = !isAtLimit || isSelected;

                return (
                  <div
                    key={habilidade.codigo}
                    className={cn(
                      'flex items-start gap-3 rounded-md border p-3 transition-colors',
                      isSelected && 'border-primary bg-primary/5',
                      canSelect
                        ? 'cursor-pointer hover:bg-muted/50'
                        : 'cursor-not-allowed opacity-50'
                    )}
                    onClick={() => canSelect && toggleHabilidade(habilidade.codigo)}
                  >
                    <Checkbox checked={isSelected} disabled={!canSelect} className="mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-0.5 text-xs font-semibold">
                          {habilidade.codigo}
                        </code>
                        <Badge variant="outline" className="text-xs">
                          {habilidade.ano}º ano
                        </Badge>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {habilidade.descricao}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Tab de Competências (se habilitado) */}
        {showCompetencias && (
          <TabsContent value="competencias" className="space-y-4">
            <Alert>
              <AlertDescription>
                Visualize e selecione habilidades agrupadas por competências gerais da BNCC.
              </AlertDescription>
            </Alert>
            {/* TODO: Implementar visualização por competências */}
            <div className="text-center text-sm text-muted-foreground">
              Visualização por competências em desenvolvimento
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

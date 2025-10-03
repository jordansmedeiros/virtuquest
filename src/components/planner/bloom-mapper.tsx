/**
 * BloomMapper - Mapeamento visual de objetivos na matriz de Bloom
 *
 * Componente interativo para mapear objetivos de aprendizagem
 * na matriz taxonômica de Bloom (6×4).
 *
 * @module components/planner/bloom-mapper
 */

'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { BloomIndicator } from '@/components/educational/bloom-indicator';
import { catalogoBloom } from '@/core/domain/bloom';
import { mapeadorBNCCBloom } from '@/core/domain/shared/mappers';
import { ProcessoCognitivo, TipoConhecimento } from '@/core/domain/bloom/types';
import { catalogoBNCC } from '@/core/domain/bncc';
import { processoToBloomLevel } from '@/lib/bloom-utils';
import type { BloomMapperProps } from '@/types/planner';
import { cn } from '@/lib/utils';
import { Lightbulb, Sparkles, Grid3x3, List, TrendingUp, AlertCircle } from 'lucide-react';

const PROCESSOS = [
  ProcessoCognitivo.LEMBRAR,
  ProcessoCognitivo.ENTENDER,
  ProcessoCognitivo.APLICAR,
  ProcessoCognitivo.ANALISAR,
  ProcessoCognitivo.AVALIAR,
  ProcessoCognitivo.CRIAR,
];

const CONHECIMENTOS = [
  TipoConhecimento.FACTUAL,
  TipoConhecimento.CONCEITUAL,
  TipoConhecimento.PROCEDIMENTAL,
  TipoConhecimento.METACOGNITIVO,
];

/**
 * BloomMapper Component
 *
 * Matriz visual 6×4 para mapeamento de objetivos de aprendizagem
 * segundo a taxonomia revisada de Bloom.
 */
export function BloomMapper({
  value,
  onChange,
  habilidadesBNCC,
  showSuggestions = false,
  className,
}: BloomMapperProps) {
  const [viewMode, setViewMode] = useState<'matriz' | 'lista' | 'progressao'>('matriz');

  // Gerar sugestões baseadas em habilidades BNCC
  const sugestoes = useMemo(() => {
    if (!showSuggestions || habilidadesBNCC.length === 0) return null;

    const celulas = habilidadesBNCC
      .map((codigo) => {
        const habilidade = catalogoBNCC.getHabilidade(codigo);
        if (!habilidade) return null;
        const mapeamento = mapeadorBNCCBloom.mapear(codigo);
        return mapeamento?.celulaPrincipal.codigo ?? null;
      })
      .filter((c): c is Exclude<typeof c, null> => c !== null);

    // Contar frequência de células
    const frequencia = celulas.reduce(
      (acc, celula) => {
        if (celula) {
          acc[celula] = (acc[celula] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    // Célula mais frequente como principal
    const principal = Object.entries(frequencia).sort(([, a], [, b]) => b - a)[0]?.[0];

    // Outras como secundárias
    const secundarias = Object.keys(frequencia)
      .filter((c) => c !== principal)
      .slice(0, 3);

    return { principal, secundarias };
  }, [habilidadesBNCC, showSuggestions]);

  // Validar progressão (placeholder - validação real seria feita aqui)
  const validacao = useMemo(() => {
    if (value.progressao.length === 0) return null;
    // Verificação simples de progressão crescente
    const problemas: string[] = [];
    for (let i = 0; i < value.progressao.length - 1; i++) {
      if (value.progressao[i + 1]! < value.progressao[i]!) {
        problemas.push('Progressão não é crescente em alguns pontos');
        break;
      }
    }
    return { valida: problemas.length === 0, problemas };
  }, [value.progressao]);

  // Handler para selecionar célula
  const handleSelectCelula = (codigo: string) => {
    if (value.principal === codigo) {
      // Desselecionar
      onChange({
        ...value,
        principal: '',
        secundarias: value.secundarias.filter((c) => c !== codigo),
      });
    } else if (value.principal === '') {
      // Definir como principal
      onChange({ ...value, principal: codigo });
    } else if (value.secundarias.includes(codigo)) {
      // Remover de secundárias
      onChange({
        ...value,
        secundarias: value.secundarias.filter((c) => c !== codigo),
      });
    } else {
      // Adicionar como secundária
      onChange({
        ...value,
        secundarias: [...value.secundarias, codigo],
      });
    }
  };

  // Aplicar sugestões
  const aplicarSugestoes = () => {
    if (!sugestoes) return;
    onChange({
      principal: sugestoes.principal || '',
      secundarias: sugestoes.secundarias || [],
      progressao: value.progressao,
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controles de Visualização */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'matriz' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('matriz')}
          >
            <Grid3x3 className="mr-2 h-4 w-4" />
            Matriz
          </Button>
          <Button
            variant={viewMode === 'lista' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('lista')}
          >
            <List className="mr-2 h-4 w-4" />
            Lista
          </Button>
          <Button
            variant={viewMode === 'progressao' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('progressao')}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Progressão
          </Button>
        </div>

        {showSuggestions && sugestoes && (
          <Button variant="secondary" size="sm" onClick={aplicarSugestoes}>
            <Sparkles className="mr-2 h-4 w-4" />
            Aplicar Sugestões
          </Button>
        )}
      </div>

      {/* Sugestões */}
      {showSuggestions && sugestoes && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              <Lightbulb className="mr-2 inline h-4 w-4" />
              Sugestões baseadas em habilidades BNCC
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-semibold">Principal sugerida:</span>{' '}
              <code className="rounded bg-muted px-2 py-0.5">{sugestoes.principal}</code>
            </div>
            {sugestoes.secundarias.length > 0 && (
              <div className="text-sm">
                <span className="font-semibold">Secundárias:</span>{' '}
                {sugestoes.secundarias.map((c) => (
                  <code key={c} className="ml-1 rounded bg-muted px-2 py-0.5">
                    {c}
                  </code>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modo Matriz */}
      {viewMode === 'matriz' && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Cabeçalho de Conhecimentos */}
            <div className="mb-2 grid grid-cols-[150px_repeat(4,1fr)] gap-2">
              <div /> {/* Espaço vazio */}
              {CONHECIMENTOS.map((conhecimento) => (
                <div key={conhecimento} className="text-center text-xs font-semibold uppercase">
                  {conhecimento.split('_').join(' ')}
                </div>
              ))}
            </div>

            {/* Matriz */}
            <div className="space-y-2">
              {PROCESSOS.map((processo, rowIndex) => (
                <div key={processo} className="grid grid-cols-[150px_repeat(4,1fr)] gap-2">
                  {/* Label do Processo */}
                  <div className="flex items-center">
                    <BloomIndicator nivel={processoToBloomLevel(processo)} showLabel />
                  </div>

                  {/* Células */}
                  {CONHECIMENTOS.map((conhecimento, colIndex) => {
                    const codigo = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
                    const celula = catalogoBloom.getCelula(processo, conhecimento);
                    const isPrincipal = value.principal === codigo;
                    const isSecundaria = value.secundarias.includes(codigo);
                    const isSugestao = sugestoes?.principal === codigo;

                    return (
                      <Tooltip key={codigo}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleSelectCelula(codigo)}
                            className={cn(
                              'relative min-h-[80px] rounded-lg border-2 p-3 text-left transition-all hover:shadow-md',
                              isPrincipal &&
                                'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2',
                              isSecundaria && 'border-primary/50 bg-primary/5',
                              !isPrincipal &&
                                !isSecundaria &&
                                'border-muted hover:border-primary/30',
                              isSugestao && 'ring-2 ring-yellow-500/50'
                            )}
                          >
                            <div className="text-xs font-bold">{codigo}</div>
                            {isPrincipal && (
                              <Badge className="absolute right-2 top-2">Principal</Badge>
                            )}
                            {celula && (
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {celula.exemplosContextualizados[0]}
                              </p>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-xs">
                            <p className="font-semibold">{celula?.descricao}</p>
                            <p className="mt-1 text-xs">
                              Verbos: {celula?.verbosCaracteristicos.slice(0, 5).join(', ')}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modo Lista */}
      {viewMode === 'lista' && (
        <div className="space-y-2">
          {PROCESSOS.flatMap((processo) =>
            CONHECIMENTOS.map((conhecimento, idx) => {
              const codigo = `${String.fromCharCode(65 + idx)}${PROCESSOS.indexOf(processo) + 1}`;
              const celula = catalogoBloom.getCelula(processo, conhecimento);
              const isPrincipal = value.principal === codigo;
              const isSecundaria = value.secundarias.includes(codigo);

              return (
                <div
                  key={codigo}
                  onClick={() => handleSelectCelula(codigo)}
                  className={cn(
                    'cursor-pointer rounded-lg border p-3 transition-colors',
                    isPrincipal && 'border-primary bg-primary/10',
                    isSecundaria && 'border-primary/50 bg-primary/5',
                    'hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <code className="rounded bg-muted px-2 py-1 font-bold">{codigo}</code>
                    <BloomIndicator nivel={processoToBloomLevel(processo)} />
                    <Badge variant="outline">{conhecimento}</Badge>
                    {isPrincipal && <Badge>Principal</Badge>}
                    {isSecundaria && <Badge variant="secondary">Secundária</Badge>}
                  </div>
                  <p className="mt-2 text-sm">{celula?.descricao}</p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modo Progressão */}
      {viewMode === 'progressao' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Progressão Cognitiva</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {value.progressao.map((processo: ProcessoCognitivo, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <BloomIndicator nivel={processoToBloomLevel(processo)} showLabel />
                    {idx < value.progressao.length - 1 && <span className="mx-2">→</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {validacao && !validacao.valida && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-semibold">Problemas na progressão:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {validacao.problemas.map((p: string, idx: number) => (
                        <li key={idx}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Resumo da Seleção */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Seleção Atual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {value.principal && (
            <div className="text-sm">
              <span className="font-semibold">Principal:</span>{' '}
              <code className="rounded bg-muted px-2 py-0.5">{value.principal}</code>
            </div>
          )}
          {value.secundarias.length > 0 && (
            <div className="text-sm">
              <span className="font-semibold">Secundárias:</span>{' '}
              {value.secundarias.map((c) => (
                <code key={c} className="ml-1 rounded bg-muted px-2 py-0.5">
                  {c}
                </code>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

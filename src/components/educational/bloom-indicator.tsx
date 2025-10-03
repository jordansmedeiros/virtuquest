/**
 * Componente BloomIndicator
 *
 * Indicador para níveis da Taxonomia de Bloom
 * conforme seção 11.3.2 do Specs.md
 */

import React from 'react';
import { BloomIcons } from '@/components/icons/educational';
import { cn } from '@/lib/utils';

// Tipos locais para BloomLevel
export type BloomLevel = 'lembrar' | 'entender' | 'aplicar' | 'analisar' | 'avaliar' | 'criar';

// ========================================
// CONFIGURAÇÕES
// ========================================

const bloomColors: Record<BloomLevel, string> = {
  lembrar: 'var(--bloom-lembrar)',
  entender: 'var(--bloom-entender)',
  aplicar: 'var(--bloom-aplicar)',
  analisar: 'var(--bloom-analisar)',
  avaliar: 'var(--bloom-avaliar)',
  criar: 'var(--bloom-criar)',
};

const bloomLabels: Record<BloomLevel, string> = {
  lembrar: 'Lembrar',
  entender: 'Entender',
  aplicar: 'Aplicar',
  analisar: 'Analisar',
  avaliar: 'Avaliar',
  criar: 'Criar',
};

// ========================================
// INTERFACES
// ========================================

interface BloomIndicatorProps {
  nivel: BloomLevel;
  variant?: 'default' | 'compact' | 'detailed';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export function BloomIndicator({
  nivel,
  variant = 'default',
  showIcon = true,
  showLabel = true,
  className,
}: BloomIndicatorProps) {
  const Icon = BloomIcons[nivel];
  const color = bloomColors[nivel];
  const label = bloomLabels[nivel];

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
          className
        )}
        style={{
          backgroundColor: `hsl(${color} / 0.1)`,
          color: `hsl(${color})`,
        }}
      >
        {showIcon && <Icon className="h-3 w-3" />}
        {showLabel && <span>{label}</span>}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={cn('flex items-start gap-3 rounded-lg border p-3', className)}
        style={{
          borderColor: `hsl(${color})`,
          backgroundColor: `hsl(${color} / 0.05)`,
        }}
      >
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `hsl(${color})` }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold" style={{ color: `hsl(${color})` }}>
            {label}
          </h4>
          <p className="text-muted-foreground mt-1 text-xs">
            Nível cognitivo da Taxonomia de Bloom
          </p>
        </div>
      </div>
    );
  }

  // Variant default
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && (
        <div
          className="flex h-3 w-3 items-center justify-center rounded-full"
          style={{ backgroundColor: `hsl(${color})` }}
        >
          <Icon className="h-2 w-2 text-white" />
        </div>
      )}
      {showLabel && (
        <span className="text-sm font-medium capitalize" style={{ color: `hsl(${color})` }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ========================================
// COMPONENTE DE PROGRESSÃO
// ========================================

interface BloomProgressionProps {
  niveis: BloomLevel[];
  currentNivel?: BloomLevel;
  className?: string;
}

/**
 * Exibe progressão através dos níveis Bloom
 */
export function BloomProgression({ niveis, currentNivel, className }: BloomProgressionProps) {
  const allLevels: BloomLevel[] = [
    'lembrar',
    'entender',
    'aplicar',
    'analisar',
    'avaliar',
    'criar',
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {allLevels.map((nivel) => {
        const isActive = niveis.includes(nivel);
        const isCurrent = nivel === currentNivel;
        const color = bloomColors[nivel];
        const Icon = BloomIcons[nivel];

        return (
          <div
            key={nivel}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-all',
              isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-30',
              isCurrent && 'ring-2 ring-offset-2'
            )}
            style={{
              backgroundColor: `hsl(${color})`,
              ...(isCurrent ? { boxShadow: `0 0 0 2px hsl(${color})` } : {}),
            }}
            title={bloomLabels[nivel]}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
        );
      })}
    </div>
  );
}

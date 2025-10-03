/**
 * Componente StatusPill
 *
 * Pills para exibir status de planos de aula
 * conforme workflow de aprovação do Specs.md
 */

import { Badge } from '@/components/ui/badge';
import { StatusIcons } from '@/components/icons/educational';
import { cn } from '@/lib/utils';

// Tipo local para PlanStatus
export type PlanStatus =
  | 'RASCUNHO'
  | 'EM_REVISAO'
  | 'PENDENTE_APROVACAO'
  | 'APROVADO'
  | 'BLOQUEADO'
  | 'PUBLICADO';

// ========================================
// CONFIGURAÇÕES DE STATUS
// ========================================

const statusConfig: Record<
  PlanStatus,
  {
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  RASCUNHO: {
    label: 'Rascunho',
    color: 'hsl(var(--muted-foreground))',
    bgColor: 'hsl(var(--muted))',
  },
  EM_REVISAO: {
    label: 'Em Revisão',
    color: 'hsl(var(--warning))',
    bgColor: 'hsl(var(--warning) / 0.1)',
  },
  PENDENTE_APROVACAO: {
    label: 'Pendente Aprovação',
    color: 'hsl(var(--warning))',
    bgColor: 'hsl(var(--warning) / 0.1)',
  },
  APROVADO: {
    label: 'Aprovado',
    color: 'hsl(var(--success))',
    bgColor: 'hsl(var(--success) / 0.1)',
  },
  BLOQUEADO: {
    label: 'Bloqueado',
    color: 'hsl(var(--destructive))',
    bgColor: 'hsl(var(--destructive) / 0.1)',
  },
  PUBLICADO: {
    label: 'Publicado',
    color: 'hsl(var(--primary))',
    bgColor: 'hsl(var(--primary) / 0.1)',
  },
};

// ========================================
// INTERFACES
// ========================================

interface StatusPillProps {
  status: PlanStatus;
  variant?: 'default' | 'outline' | 'solid';
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export function StatusPill({
  status,
  variant = 'default',
  showIcon = true,
  size = 'md',
  className,
}: StatusPillProps) {
  const config = statusConfig[status];
  const Icon = StatusIcons[status];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  if (variant === 'solid') {
    return (
      <Badge
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          sizeClasses[size],
          className
        )}
        style={{
          backgroundColor: config.color,
          color: 'white',
        }}
      >
        {showIcon && <Icon className={iconSizes[size]} />}
        {config.label}
      </Badge>
    );
  }

  if (variant === 'outline') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          sizeClasses[size],
          className
        )}
        style={{
          borderColor: config.color,
          color: config.color,
          backgroundColor: 'transparent',
        }}
      >
        {showIcon && <Icon className={iconSizes[size]} />}
        {config.label}
      </Badge>
    );
  }

  // Variant default
  return (
    <Badge
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
}

// ========================================
// COMPONENTE DE TIMELINE
// ========================================

interface StatusTimelineProps {
  currentStatus: PlanStatus;
  history?: Array<{
    status: PlanStatus;
    timestamp: Date;
    user?: string;
  }>;
  className?: string;
}

/**
 * Exibe timeline de mudanças de status
 */
export function StatusTimeline({ currentStatus, history = [], className }: StatusTimelineProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {history.map((item, index) => {
        const config = statusConfig[item.status];
        const Icon = StatusIcons[item.status];
        const isLast = index === history.length - 1;

        return (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: config.color }}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              {!isLast && (
                <div
                  className="mt-1 h-full min-h-[20px] w-0.5"
                  style={{ backgroundColor: config.color, opacity: 0.3 }}
                />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium" style={{ color: config.color }}>
                  {config.label}
                </span>
                {item.status === currentStatus && (
                  <Badge variant="outline" className="text-xs">
                    Atual
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {item.timestamp.toLocaleString('pt-BR')}
                {item.user && ` • ${item.user}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

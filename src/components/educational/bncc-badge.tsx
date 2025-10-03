/**
 * Componente BNCCBadge
 *
 * Badge para exibir competências e habilidades BNCC
 * conforme seção 11.3.2 do Specs.md
 */

import { Badge } from '@/components/ui/badge';
import { BNCCIcons } from '@/components/icons/educational';
import { cn } from '@/lib/utils';

// ========================================
// INTERFACES
// ========================================

interface BNCCBadgeProps {
  competencia?: string;
  habilidade?: string;
  objetoConhecimento?: string;
  variant?: 'default' | 'outline';
  showIcon?: boolean;
  className?: string;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export function BNCCBadge({
  competencia,
  habilidade,
  objetoConhecimento,
  variant = 'default',
  showIcon = true,
  className,
}: BNCCBadgeProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {competencia && (
        <Badge
          variant={variant}
          className={cn(
            'transition-colors duration-200',
            variant === 'outline'
              ? 'border-[hsl(var(--bncc-competencia))] bg-transparent text-[hsl(var(--bncc-competencia))]'
              : 'bg-[hsl(var(--bncc-competencia))] text-white hover:bg-[hsl(var(--bncc-competencia))]/90'
          )}
        >
          {showIcon && <BNCCIcons.competencia className="mr-1 h-3 w-3" />}
          {competencia}
        </Badge>
      )}

      {habilidade && (
        <Badge
          variant={variant}
          className={cn(
            'transition-colors duration-200',
            variant === 'outline'
              ? 'border-[hsl(var(--bncc-habilidade))] bg-transparent text-[hsl(var(--bncc-habilidade))]'
              : 'bg-[hsl(var(--bncc-habilidade))] text-white hover:bg-[hsl(var(--bncc-habilidade))]/90'
          )}
        >
          {showIcon && <BNCCIcons.habilidade className="mr-1 h-3 w-3" />}
          {habilidade}
        </Badge>
      )}

      {objetoConhecimento && (
        <Badge
          variant={variant}
          className={cn(
            'transition-colors duration-200',
            variant === 'outline'
              ? 'border-[hsl(var(--bncc-objeto-conhecimento))] bg-transparent text-[hsl(var(--bncc-objeto-conhecimento))]'
              : 'bg-[hsl(var(--bncc-objeto-conhecimento))] text-white hover:bg-[hsl(var(--bncc-objeto-conhecimento))]/90'
          )}
        >
          {showIcon && <BNCCIcons.objetoConhecimento className="mr-1 h-3 w-3" />}
          {objetoConhecimento}
        </Badge>
      )}
    </div>
  );
}

// ========================================
// VARIANTE COMPACTA
// ========================================

interface BNCCBadgeCompactProps {
  codigo: string;
  tipo?: 'competencia' | 'habilidade' | 'objetoConhecimento';
  className?: string;
}

/**
 * Badge compacto para listas
 */
export function BNCCBadgeCompact({
  codigo,
  tipo = 'habilidade',
  className,
}: BNCCBadgeCompactProps) {
  const colorMap = {
    competencia: 'var(--bncc-competencia)',
    habilidade: 'var(--bncc-habilidade)',
    objetoConhecimento: 'var(--bncc-objeto-conhecimento)',
  };

  return (
    <Badge
      variant="outline"
      className={cn('font-mono text-xs', className)}
      style={{
        borderColor: `hsl(${colorMap[tipo]})`,
        color: `hsl(${colorMap[tipo]})`,
      }}
    >
      {codigo}
    </Badge>
  );
}

/**
 * EXEMPLOS DE USO:
 *
 * // Badge com competência e habilidade
 * <BNCCBadge
 *   competencia="CG01"
 *   habilidade="EF67LP28"
 * />
 *
 * // Badge outline sem ícone
 * <BNCCBadge
 *   habilidade="EF67LP28"
 *   variant="outline"
 *   showIcon={false}
 * />
 *
 * // Badge compacto
 * <BNCCBadgeCompact codigo="EF67LP28" tipo="habilidade" />
 */

/**
 * Componente PlanoAulaCard
 *
 * Card para exibir planos de aula com badges educacionais
 * conforme seção 11.3.2 do Specs.md
 */

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BNCCBadge } from './bncc-badge';
import { BloomIndicator, type BloomLevel } from './bloom-indicator';
import { StatusPill, type PlanStatus } from './status-pill';
import { GeneralIcons } from '@/components/icons/educational';
import { cn } from '@/lib/utils';

// ========================================
// INTERFACES
// ========================================

interface PlanoAula {
  id: string;
  titulo: string;
  descricao?: string;
  disciplina: string;
  turma: string;
  data?: Date;
  duracao?: number; // em minutos
  status: PlanStatus;
  competencias?: string[];
  habilidades?: string[];
  niveisBloom?: BloomLevel[];
  professor?: {
    nome: string;
    avatar?: string;
  };
}

interface PlanoAulaCardProps {
  plano: PlanoAula;
  variant?: 'default' | 'compact' | 'detailed';
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

// ========================================
// MAPEAMENTO DE CORES POR STATUS
// ========================================

const statusBorderColors: Record<PlanStatus, string> = {
  RASCUNHO: 'hsl(var(--muted))',
  EM_REVISAO: 'hsl(var(--warning))',
  PENDENTE_APROVACAO: 'hsl(var(--warning))',
  APROVADO: 'hsl(var(--success))',
  BLOQUEADO: 'hsl(var(--destructive))',
  PUBLICADO: 'hsl(var(--primary))',
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export function PlanoAulaCard({
  plano,
  variant = 'default',
  onEdit,
  onView,
  onDelete,
  className,
}: PlanoAulaCardProps) {
  const borderColor = statusBorderColors[plano.status];

  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          'relative cursor-pointer overflow-hidden border-l-4 transition-shadow hover:shadow-md',
          className
        )}
        style={{ borderLeftColor: borderColor }}
        onClick={() => onView?.(plano.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-base">{plano.titulo}</CardTitle>
              <CardDescription className="mt-1 text-xs">
                {plano.disciplina} • {plano.turma}
              </CardDescription>
            </div>
            <StatusPill status={plano.status} size="sm" showIcon={false} />
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card
        className={cn('relative overflow-hidden border-l-4', className)}
        style={{ borderLeftColor: borderColor }}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <StatusPill status={plano.status} />
                {plano.data && (
                  <Badge variant="outline" className="text-xs">
                    <GeneralIcons.calendario className="mr-1 h-3 w-3" />
                    {plano.data.toLocaleDateString('pt-BR')}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{plano.titulo}</CardTitle>
              <CardDescription className="mt-2">{plano.descricao}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Disciplina:</span>
              <p className="font-medium">{plano.disciplina}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Turma:</span>
              <p className="font-medium">{plano.turma}</p>
            </div>
            {plano.duracao && (
              <div>
                <span className="text-muted-foreground">Duração:</span>
                <p className="font-medium">{plano.duracao} minutos</p>
              </div>
            )}
          </div>

          {/* BNCC */}
          {(plano.competencias || plano.habilidades) && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">BNCC</h4>
              <BNCCBadge
                competencia={plano.competencias?.[0]}
                habilidade={plano.habilidades?.[0]}
              />
              {(plano.competencias && plano.competencias.length > 1) ||
              (plano.habilidades && plano.habilidades.length > 1) ? (
                <Badge variant="outline" className="ml-2 text-xs">
                  +{(plano.competencias?.length || 0) + (plano.habilidades?.length || 0) - 1} mais
                </Badge>
              ) : null}
            </div>
          )}

          {/* Bloom */}
          {plano.niveisBloom && plano.niveisBloom.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">Taxonomia de Bloom</h4>
              <div className="flex flex-wrap gap-2">
                {plano.niveisBloom.slice(0, 3).map((nivel) => (
                  <BloomIndicator key={nivel} nivel={nivel} variant="compact" />
                ))}
                {plano.niveisBloom.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plano.niveisBloom.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Professor */}
          {plano.professor && (
            <div className="flex items-center gap-2 border-t pt-2">
              <GeneralIcons.professor className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">{plano.professor.nome}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(plano.id)}>
              Visualizar
            </Button>
          )}
          {onEdit && (
            <Button variant="default" size="sm" onClick={() => onEdit(plano.id)}>
              Editar
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(plano.id)}>
              Excluir
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Variant default
  return (
    <Card
      className={cn(
        'relative overflow-hidden border-l-4 transition-shadow hover:shadow-md',
        className
      )}
      style={{ borderLeftColor: borderColor }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">{plano.titulo}</CardTitle>
            <CardDescription className="mt-1">
              {plano.disciplina} • {plano.turma}
              {plano.data && ` • ${plano.data.toLocaleDateString('pt-BR')}`}
            </CardDescription>
          </div>
          <StatusPill status={plano.status} size="sm" />
        </div>
      </CardHeader>

      {(plano.descricao || plano.habilidades || plano.niveisBloom) && (
        <CardContent className="space-y-3">
          {plano.descricao && (
            <p className="text-muted-foreground line-clamp-2 text-sm">{plano.descricao}</p>
          )}

          {plano.habilidades && plano.habilidades.length > 0 && (
            <BNCCBadge habilidade={plano.habilidades[0]} />
          )}

          {plano.niveisBloom && plano.niveisBloom.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {plano.niveisBloom.slice(0, 2).map((nivel) => (
                <BloomIndicator key={nivel} nivel={nivel} variant="compact" showLabel={false} />
              ))}
            </div>
          )}
        </CardContent>
      )}

      {(onView || onEdit) && (
        <CardFooter className="flex gap-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(plano.id)} className="flex-1">
              Ver Detalhes
            </Button>
          )}
          {onEdit && (
            <Button variant="default" size="sm" onClick={() => onEdit(plano.id)} className="flex-1">
              Editar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

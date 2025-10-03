/**
 * Educational Grid Components - Grid helpers leveraging Tailwind breakpoints
 *
 * Grid helpers (EducationalGrid, GridWithHeader, MasonryGrid, StackedGrid)
 * leveraging Tailwind breakpoints
 * Conforme especificado em Specs.md seção 11
 */

'use client';

import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface BaseGridProps {
  children: ReactNode;
  className?: string;
}

interface GridWithHeaderProps extends BaseGridProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * EducationalGrid - Base responsive grid for educational content
 */
export function EducationalGrid({ children, className }: BaseGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 ${className || ''}`}
    >
      {children}
    </div>
  );
}

/**
 * GridWithHeader - Grid with title, description and optional actions
 */
export function GridWithHeader({
  children,
  title,
  description,
  actions,
  className,
}: GridWithHeaderProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-col gap-2 sm:flex-row">{actions}</div>}
      </div>

      <Separator />

      {/* Grid Content */}
      <EducationalGrid>{children}</EducationalGrid>
    </div>
  );
}

/**
 * MasonryGrid - Pinterest-style masonry layout for cards of varying heights
 */
export function MasonryGrid({ children, className }: BaseGridProps) {
  return (
    <div
      className={`columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4 ${className || ''}`}
    >
      {children}
    </div>
  );
}

/**
 * StackedGrid - Vertical stacked layout with responsive margins
 */
export function StackedGrid({ children, className }: BaseGridProps) {
  return <div className={`space-y-4 sm:space-y-6 lg:space-y-8 ${className || ''}`}>{children}</div>;
}

/**
 * GridCard - Specialized card for grid layouts with educational content
 */
interface GridCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GridCard({ title, subtitle, children, className, onClick }: GridCardProps) {
  return (
    <Card
      className={`h-fit transition-shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

/**
 * ResponsiveContainer - Utility container with responsive breakpoints
 */
interface ResponsiveContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

export function ResponsiveContainer({
  children,
  maxWidth = 'full',
  className,
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className || ''}`}>
      {children}
    </div>
  );
}

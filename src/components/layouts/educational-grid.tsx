/**
 * Educational Grid Components - VirtuQuest Design System
 *
 * Grid layout helpers for educational content with responsive breakpoints
 * Conforme SPECS.md seção 11 - Design System Infrastructure
 */

import { cn } from '@/lib/utils';

export interface EducationalGridProps {
  /** Grid items */
  children: React.ReactNode;
  /** Number of columns (responsive) */
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Gap between items */
  gap?: 2 | 4 | 6 | 8;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Base responsive grid for educational content
 */
export function EducationalGrid({
  children,
  columns = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className,
}: EducationalGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const gridColsSm = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
  };

  const gridColsMd = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  };

  const gridColsLg = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  };

  const gridColsXl = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div
      className={cn(
        'grid',
        columns.default && gridCols[columns.default as keyof typeof gridCols],
        columns.sm && gridColsSm[columns.sm as keyof typeof gridColsSm],
        columns.md && gridColsMd[columns.md as keyof typeof gridColsMd],
        columns.lg && gridColsLg[columns.lg as keyof typeof gridColsLg],
        columns.xl && gridColsXl[columns.xl as keyof typeof gridColsXl],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

export interface GridWithHeaderProps {
  /** Header title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional header actions */
  actions?: React.ReactNode;
  /** Grid content */
  children: React.ReactNode;
  /** Grid configuration */
  gridProps?: Omit<EducationalGridProps, 'children'>;
}

/**
 * Grid with header section
 */
export function GridWithHeader({
  title,
  description,
  actions,
  children,
  gridProps,
}: GridWithHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Grid */}
      <EducationalGrid {...gridProps}>{children}</EducationalGrid>
    </div>
  );
}

export interface MasonryGridProps {
  /** Grid items */
  children: React.ReactNode;
  /** Number of columns */
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  /** Gap between items */
  gap?: 2 | 4 | 6 | 8;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Masonry-style grid (CSS columns-based)
 */
export function MasonryGrid({
  children,
  columns = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className,
}: MasonryGridProps) {
  const colClasses = {
    1: 'columns-1',
    2: 'columns-2',
    3: 'columns-3',
    4: 'columns-4',
    5: 'columns-5',
    6: 'columns-6',
  };

  const colClassesSm = {
    1: 'sm:columns-1',
    2: 'sm:columns-2',
    3: 'sm:columns-3',
    4: 'sm:columns-4',
    5: 'sm:columns-5',
    6: 'sm:columns-6',
  };

  const colClassesMd = {
    1: 'md:columns-1',
    2: 'md:columns-2',
    3: 'md:columns-3',
    4: 'md:columns-4',
    5: 'md:columns-5',
    6: 'md:columns-6',
  };

  const colClassesLg = {
    1: 'lg:columns-1',
    2: 'lg:columns-2',
    3: 'lg:columns-3',
    4: 'lg:columns-4',
    5: 'lg:columns-5',
    6: 'lg:columns-6',
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div
      className={cn(
        columns.default && colClasses[columns.default as keyof typeof colClasses],
        columns.sm && colClassesSm[columns.sm as keyof typeof colClassesSm],
        columns.md && colClassesMd[columns.md as keyof typeof colClassesMd],
        columns.lg && colClassesLg[columns.lg as keyof typeof colClassesLg],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

export interface StackedGridProps {
  /** Grid items */
  children: React.ReactNode;
  /** Gap between items */
  gap?: 2 | 4 | 6 | 8;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Single-column stacked layout (mobile-first)
 */
export function StackedGrid({ children, gap = 4, className }: StackedGridProps) {
  const gapClasses = {
    2: 'space-y-2',
    4: 'space-y-4',
    6: 'space-y-6',
    8: 'space-y-8',
  };

  return <div className={cn('flex flex-col', gapClasses[gap], className)}>{children}</div>;
}

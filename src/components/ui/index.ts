/**
 * Componentes UI - VirtuQuest Design System
 *
 * Re-exports dos componentes shadcn/ui oficiais implementados
 * Conforme especificado em SPECS.md seção 11.3.1
 */

// ========================================
// COMPONENTES BASE
// ========================================
export * from './button';
export * from './badge';
export * from './card';
export * from './label';
export * from './separator';
export * from './command';
export * from './popover';
export * from './dialog';
export * from './dropdown-menu';
export * from './table';

// ========================================
// COMPONENTES DE FORMULÁRIO
// ========================================
export * from './shadcn-io/calendar';
export * from './shadcn-io/combobox';
// Advanced table exports with different namespace to avoid conflicts
export {
  TableProvider as AdvancedTableProvider,
  TableContext as AdvancedTableContext,
  TableColumnHeader,
  type ColumnDef,
  type TableProviderProps,
  type TableColumnHeaderProps,
} from './shadcn-io/table';
export * from './shadcn-io/tabs';
export * from './shadcn-io/theme-switcher';

// ========================================
// COMPONENTES DE LAYOUT
// ========================================

// ========================================
// COMPONENTES DE NAVEGAÇÃO
// ========================================

// ========================================
// COMPONENTES DE FEEDBACK
// ========================================

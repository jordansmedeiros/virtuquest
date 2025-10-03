/**
 * Sidebar - VirtuQuest Design System
 *
 * Desktop sidebar and mobile sheet navigation component
 * Conforme SPECS.md seção 11 - Design System Infrastructure
 */

'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  /** Additional CSS classes */
  className?: string;
  /** Navigation items */
  children?: React.ReactNode;
  /** Whether sidebar is open (for mobile) */
  isOpen?: boolean;
  /** Callback when sidebar is closed (for mobile) */
  onClose?: () => void;
  /** Sidebar title */
  title?: string;
}

export function Sidebar({ className, children, isOpen = false, onClose, title }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          // Base styles
          'bg-background fixed top-0 left-0 z-50 h-screen w-64 border-r transition-transform duration-300',
          // Desktop: always visible, pushed down by header
          'md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Mobile header with close button */}
        <div className="flex h-14 items-center justify-between border-b px-4 md:hidden">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation content */}
        <nav className="flex flex-col gap-2 p-4">{children}</nav>
      </aside>
    </>
  );
}

export interface SidebarNavItemProps {
  /** Item label */
  label: string;
  /** Item icon */
  icon?: React.ComponentType<{ className?: string }>;
  /** Whether item is active */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function SidebarNavItem({
  label,
  icon: Icon,
  active = false,
  onClick,
  className,
}: SidebarNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-secondary text-secondary-foreground'
          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{label}</span>
    </button>
  );
}

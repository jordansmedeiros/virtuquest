/**
 * Header - VirtuQuest Design System
 *
 * Top navigation component with theme toggle and mobile menu trigger
 * Conforme SPECS.md seção 11 - Design System Infrastructure
 */

'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  /** Additional CSS classes */
  className?: string;
  /** Logo or brand component */
  logo?: React.ReactNode;
  /** Navigation items for desktop */
  navItems?: React.ReactNode;
  /** Callback when mobile menu is triggered */
  onMobileMenuToggle?: () => void;
  /** Whether the mobile menu is currently open */
  isMobileMenuOpen?: boolean;
}

export function Header({
  className,
  logo,
  navItems,
  onMobileMenuToggle,
  isMobileMenuOpen = false,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        'bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur',
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuToggle}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          {logo || <span className="text-foreground text-lg font-semibold">VirtuQuest</span>}
        </div>

        {/* Desktop navigation */}
        {navItems && <nav className="hidden md:flex md:items-center md:gap-6">{navItems}</nav>}

        {/* Theme switcher */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher value={theme} onChange={setTheme} className="ml-auto" />
        </div>
      </div>
    </header>
  );
}

/**
 * Header Component - Navigation with theme toggle and mobile menu
 *
 * Top navigation with theme toggle and mobile menu trigger using useTheme
 * Conforme especificado em Specs.md seção 11
 */

'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';
import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  className?: string;
}

export function Header({ onMobileMenuToggle, isMobileMenuOpen = false, className }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header
      className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur ${className || ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuToggle}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Brand */}
            <div className="flex items-center space-x-2">
              <h1 className="text-primary text-xl font-bold">VirtuQuest</h1>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <a
              href="/professor"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Planos de Aula
            </a>
            <a
              href="/biblioteca"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Biblioteca
            </a>
            <a
              href="/relatorios"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Relatórios
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />

            {/* User menu placeholder */}
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Prof. Maria
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

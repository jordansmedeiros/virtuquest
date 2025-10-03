/**
 * Header Component - Navigation with theme toggle and mobile menu
 *
 * Top navigation with theme toggle and mobile menu trigger using useTheme
 * Conforme especificado em Specs.md seção 11
 */

'use client';

import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';
import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';
import { useCurrentUser } from '@/hooks/use-current-user';
import { logoutAction } from '@/core/auth/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  className?: string;
}

export function Header({ onMobileMenuToggle, isMobileMenuOpen = false, className }: HeaderProps) {
  useTheme(); // Ensure ThemeProvider is available
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className || ''}`}
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
              <h1 className="text-xl font-bold text-primary">VirtuQuest</h1>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <a
              href="/professor"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Planos de Aula
            </a>
            <a
              href="/biblioteca"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Biblioteca
            </a>
            <a
              href="/relatorios"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Relatórios
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />

            {/* User menu with authentication */}
            {isLoading ? (
              <Button variant="ghost" size="sm" className="hidden md:inline-flex" disabled>
                Carregando...
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                    <User className="mr-2 h-4 w-4" />
                    {user.nome}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.nome}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs capitalize leading-none text-muted-foreground">
                        {user.tipo}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

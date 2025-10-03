/**
 * Sidebar Component - Desktop sidebar and mobile sheet navigation with RBAC
 *
 * Desktop sidebar and mobile sheet navigation referencing lucide icons
 * Filters navigation items based on user role
 * Conforme especificado em Specs.md seção 11
 */

'use client';

import {
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Users,
  FileText,
  GraduationCap,
  Target,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserType } from '@/core/infrastructure/n8n/types';
import { useMemo } from 'react';

interface SidebarProps {
  className?: string;
  onItemClick?: () => void; // Para fechar menu mobile
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  allowedRoles: UserType[];
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationItems: NavigationSection[] = [
  {
    title: 'Planejamento',
    items: [
      {
        title: 'Planos de Aula',
        href: '/professor/planos',
        icon: BookOpen,
        description: 'Criar e gerenciar planos de aula',
        allowedRoles: [
          UserType.PROFESSOR,
          UserType.COORDENADOR,
          UserType.SUPERVISOR,
          UserType.DIRETOR,
          UserType.ADMIN,
        ],
      },
      {
        title: 'Cronograma',
        href: '/professor/cronograma',
        icon: Calendar,
        description: 'Visualizar cronograma anual',
        allowedRoles: [
          UserType.PROFESSOR,
          UserType.COORDENADOR,
          UserType.SUPERVISOR,
          UserType.DIRETOR,
          UserType.ADMIN,
        ],
      },
    ],
  },
  {
    title: 'Recursos',
    items: [
      {
        title: 'Biblioteca BNCC',
        href: '/biblioteca/bncc',
        icon: GraduationCap,
        description: 'Competências e habilidades',
        allowedRoles: [
          UserType.PROFESSOR,
          UserType.COORDENADOR,
          UserType.SUPERVISOR,
          UserType.DIRETOR,
          UserType.ADMIN,
        ],
      },
      {
        title: 'Taxonomia Bloom',
        href: '/biblioteca/bloom',
        icon: Target,
        description: 'Níveis cognitivos',
        allowedRoles: [
          UserType.PROFESSOR,
          UserType.COORDENADOR,
          UserType.SUPERVISOR,
          UserType.DIRETOR,
          UserType.ADMIN,
        ],
      },
      {
        title: 'Virtudes',
        href: '/biblioteca/virtudes',
        icon: Award,
        description: 'Virtudes intelectuais',
        allowedRoles: [
          UserType.PROFESSOR,
          UserType.COORDENADOR,
          UserType.SUPERVISOR,
          UserType.DIRETOR,
          UserType.ADMIN,
        ],
      },
    ],
  },
  {
    title: 'Gestão',
    items: [
      {
        title: 'Relatórios',
        href: '/gestao/relatorios',
        icon: BarChart3,
        description: 'Análises e métricas',
        allowedRoles: [UserType.COORDENADOR, UserType.SUPERVISOR, UserType.DIRETOR, UserType.ADMIN],
      },
      {
        title: 'Turmas',
        href: '/gestao/turmas',
        icon: Users,
        description: 'Gerenciar turmas',
        allowedRoles: [UserType.COORDENADOR, UserType.SUPERVISOR, UserType.DIRETOR, UserType.ADMIN],
      },
    ],
  },
];

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const { user } = useCurrentUser();

  // Filter navigation items based on user role
  const filteredNavigation = useMemo(() => {
    if (!user) return [];

    const userType = user.tipo.toUpperCase() as UserType;

    return navigationItems
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.allowedRoles.includes(userType)),
      }))
      .filter((section) => section.items.length > 0);
  }, [user]);

  return (
    <div className={`flex h-full flex-col ${className || ''}`}>
      {/* Sidebar Header */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground">Menu Principal</h2>
        <p className="text-sm text-muted-foreground">Sistema pedagógico integrado</p>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-4">
        {filteredNavigation.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="h-auto w-full justify-start px-3 py-2"
                    onClick={onItemClick}
                    asChild
                  >
                    <a href={item.href}>
                      <Icon className="mr-3 h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <Separator />

      {/* Bottom section */}
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start" onClick={onItemClick} asChild>
          <a href="/configuracoes">
            <Settings className="mr-3 h-4 w-4" />
            <span>Configurações</span>
          </a>
        </Button>

        <Button variant="ghost" className="mt-1 w-full justify-start" onClick={onItemClick} asChild>
          <a href="/ajuda">
            <FileText className="mr-3 h-4 w-4" />
            <span>Ajuda</span>
          </a>
        </Button>
      </div>
    </div>
  );
}

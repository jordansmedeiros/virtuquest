/**
 * Sidebar Component - Desktop sidebar and mobile sheet navigation
 *
 * Desktop sidebar and mobile sheet navigation referencing lucide icons
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

interface SidebarProps {
  className?: string;
  onItemClick?: () => void; // Para fechar menu mobile
}

const navigationItems = [
  {
    title: 'Planejamento',
    items: [
      {
        title: 'Planos de Aula',
        href: '/professor/planos',
        icon: BookOpen,
        description: 'Criar e gerenciar planos de aula',
      },
      {
        title: 'Cronograma',
        href: '/professor/cronograma',
        icon: Calendar,
        description: 'Visualizar cronograma anual',
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
      },
      {
        title: 'Taxonomia Bloom',
        href: '/biblioteca/bloom',
        icon: Target,
        description: 'Níveis cognitivos',
      },
      {
        title: 'Virtudes',
        href: '/biblioteca/virtudes',
        icon: Award,
        description: 'Virtudes intelectuais',
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
      },
      {
        title: 'Turmas',
        href: '/gestao/turmas',
        icon: Users,
        description: 'Gerenciar turmas',
      },
    ],
  },
];

export function Sidebar({ className, onItemClick }: SidebarProps) {
  return (
    <div className={`flex h-full flex-col ${className || ''}`}>
      {/* Sidebar Header */}
      <div className="p-6">
        <h2 className="text-foreground text-lg font-semibold">Menu Principal</h2>
        <p className="text-muted-foreground text-sm">Sistema pedagógico integrado</p>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-4">
        {navigationItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-muted-foreground mb-3 px-3 text-xs font-semibold tracking-wide uppercase">
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
                        <span className="text-muted-foreground text-xs">{item.description}</span>
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

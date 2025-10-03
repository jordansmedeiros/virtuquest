/**
 * MainLayout - VirtuQuest Design System
 *
 * Main layout component integrating header + sidebar with responsive behavior
 * Conforme SPECS.md seção 11 - Design System Infrastructure
 */

'use client';

import { useState } from 'react';
import { Header, type HeaderProps } from './header';
import { Sidebar, type SidebarProps } from './sidebar';
import { cn } from '@/lib/utils';

export interface MainLayoutProps {
  /** Additional CSS classes for the container */
  className?: string;
  /** Header configuration */
  header?: Omit<HeaderProps, 'onMobileMenuToggle' | 'isMobileMenuOpen'>;
  /** Sidebar configuration */
  sidebar?: Omit<SidebarProps, 'isOpen' | 'onClose'>;
  /** Main content */
  children: React.ReactNode;
  /** Whether to show the sidebar */
  showSidebar?: boolean;
}

export function MainLayout({
  className,
  header,
  sidebar,
  children,
  showSidebar = true,
}: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-background relative min-h-screen">
      {/* Header */}
      <Header
        {...header}
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar {...sidebar} isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />
        )}

        {/* Main content area */}
        <main
          className={cn(
            'flex-1 overflow-x-hidden',
            // Add left padding on desktop when sidebar is shown
            showSidebar && 'md:ml-0',
            className
          )}
        >
          <div className="container px-4 py-6 md:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

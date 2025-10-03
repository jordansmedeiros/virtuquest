/**
 * MainLayout Component - Integrates header + sidebar with responsive behavior
 *
 * Integrates header + sidebar, manages mobile drawer state, wraps children
 * in responsive content container
 * Conforme especificado em Specs.md seção 11
 */

'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`bg-background min-h-screen ${className || ''}`}>
      {/* Header */}
      <Header onMobileMenuToggle={handleMobileMenuToggle} isMobileMenuOpen={isMobileMenuOpen} />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="bg-background hidden w-64 border-r md:flex md:flex-col">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0" onInteractOutside={handleMobileMenuClose}>
            <Sidebar onItemClick={handleMobileMenuClose} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {/* Content Container with responsive padding */}
          <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

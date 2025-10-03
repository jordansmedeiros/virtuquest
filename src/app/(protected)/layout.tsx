/**
 * Layout para páginas protegidas (professor, gestao, admin)
 * @module app/(protected)/layout
 */

import { redirect } from 'next/navigation';
import { requireUser } from '@/core/auth/session';
import { MainLayout } from '@/components/layouts/main-layout';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Verificar autenticação (redirect se não autenticado)
  try {
    await requireUser();
  } catch (error) {
    // Redirecionar para login se não autenticado
    redirect('/login');
  }

  return <MainLayout>{children}</MainLayout>;
}

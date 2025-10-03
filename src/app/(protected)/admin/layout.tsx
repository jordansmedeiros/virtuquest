/**
 * Layout para páginas de Administração com validação de role server-side
 * @module app/(protected)/admin/layout
 */

import { redirect } from 'next/navigation';
import { requireRole } from '@/core/auth/session';
import { UserType } from '@/core/infrastructure/n8n/types';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    // Garantir que usuário tem role ADMIN
    await requireRole([UserType.ADMIN]);
  } catch (error) {
    // Redirecionar para página de acesso negado se não autorizado
    redirect('/403');
  }

  return <>{children}</>;
}

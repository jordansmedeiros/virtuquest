/**
 * Layout para páginas do Professor com validação de role server-side
 * @module app/(protected)/professor/layout
 */

import { redirect } from 'next/navigation';
import { requireRole } from '@/core/auth/session';
import { UserType } from '@/core/infrastructure/n8n/types';

export default async function ProfessorLayout({ children }: { children: React.ReactNode }) {
  try {
    // Garantir que usuário tem role PROFESSOR ou ADMIN
    await requireRole([UserType.PROFESSOR, UserType.ADMIN]);
  } catch (error) {
    // Redirecionar para página de acesso negado se não autorizado
    redirect('/403');
  }

  return <>{children}</>;
}

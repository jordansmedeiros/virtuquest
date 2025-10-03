/**
 * Layout para páginas de Gestão com validação de role server-side
 * @module app/(protected)/gestao/layout
 */

import { redirect } from 'next/navigation';
import { requireRole } from '@/core/auth/session';
import { UserType } from '@/core/infrastructure/n8n/types';

export default async function GestaoLayout({ children }: { children: React.ReactNode }) {
  try {
    // Garantir que usuário tem role de gestão
    await requireRole([
      UserType.COORDENADOR,
      UserType.SUPERVISOR,
      UserType.DIRETOR,
      UserType.ADMIN,
    ]);
  } catch (error) {
    // Redirecionar para página de acesso negado se não autorizado
    redirect('/403');
  }

  return <>{children}</>;
}

/**
 * Layout para páginas de autenticação (login, register)
 * @module app/(auth)/layout
 */

import { redirect } from 'next/navigation';
import { getSession } from '@/core/auth/session';
import { UserType } from '@/core/infrastructure/n8n/types';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Verificar se usuário já está autenticado
  const session = await getSession();

  if (session) {
    // Redirecionar para dashboard baseado no role
    const defaultRoute = getDefaultRouteByRole(session.user.tipo);
    redirect(defaultRoute);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
            <span className="text-2xl font-bold text-primary-foreground">V</span>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

/**
 * Helper para obter rota padrão por role
 */
function getDefaultRouteByRole(userType: UserType): string {
  switch (userType) {
    case UserType.PROFESSOR:
      return '/professor';
    case UserType.COORDENADOR:
    case UserType.SUPERVISOR:
    case UserType.DIRETOR:
      return '/gestao';
    case UserType.ADMIN:
      return '/admin';
    default:
      return '/';
  }
}

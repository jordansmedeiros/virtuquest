/**
 * Hook para verificações de autorização RBAC
 * @module hooks/use-authorization
 */

'use client';

import { useAuthStore } from '@/stores/auth-store';
import {
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasAllPermissions as checkAllPermissions,
  canAccessRoute as checkRouteAccess,
} from '@/core/auth/permissions';
import type { Permission, UserType } from '@/core/infrastructure/n8n/types';
import type { ReactNode } from 'react';

// ============================================================================
// Hook Principal
// ============================================================================

/**
 * Hook para verificações de autorização
 */
export function useAuthorization() {
  const user = useAuthStore((state) => state.user);

  return {
    // Verificação de permissões
    hasPermission: (permission: Permission): boolean => {
      if (!user) return false;
      return checkPermission(user.tipo, permission);
    },

    hasAnyPermission: (permissions: Permission[]): boolean => {
      if (!user) return false;
      return checkAnyPermission(user.tipo, permissions);
    },

    hasAllPermissions: (permissions: Permission[]): boolean => {
      if (!user) return false;
      return checkAllPermissions(user.tipo, permissions);
    },

    // Verificação de rotas
    canAccessRoute: (route: string): boolean => {
      if (!user) return false;
      return checkRouteAccess(user.tipo, route);
    },

    // Verificação de roles
    hasRole: (roles: UserType[]): boolean => {
      if (!user) return false;
      return roles.includes(user.tipo);
    },

    // Computed values
    isAdmin: user?.tipo === 'ADMIN',
    isProfessor: user?.tipo === 'PROFESSOR',
    isCoordenador: user?.tipo === 'COORDENADOR',
    isSupervisor: user?.tipo === 'SUPERVISOR',
    isDiretor: user?.tipo === 'DIRETOR',
  };
}

// ============================================================================
// Hooks Especializados
// ============================================================================

/**
 * Verifica se tem permissão específica
 */
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission(permission);
}

/**
 * Verifica se pode acessar rota
 */
export function useCanAccessRoute(route: string): boolean {
  const { canAccessRoute } = useAuthorization();
  return canAccessRoute(route);
}

// ============================================================================
// Componente de Proteção
// ============================================================================

interface ProtectedContentProps {
  permission?: Permission;
  roles?: UserType[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renderiza conteúdo apenas se autorizado
 * ATENÇÃO: Isso é apenas para UI. SEMPRE validar no backend!
 */
export function ProtectedContent({
  permission,
  roles,
  fallback = null,
  children,
}: ProtectedContentProps): ReactNode {
  const authorization = useAuthorization();

  // Verificar permissão se fornecida
  if (permission && !authorization.hasPermission(permission)) {
    return fallback;
  }

  // Verificar roles se fornecidos
  if (roles && !authorization.hasRole(roles)) {
    return fallback;
  }

  return children;
}

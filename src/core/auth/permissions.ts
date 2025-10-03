/**
 * Sistema RBAC (Role-Based Access Control) para VirtuQuest
 * @module core/auth/permissions
 */

import { UserType, type Permission, type RolePermissions } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Mapeamento de Permissões por Role
// ============================================================================

/**
 * Mapeamento completo de permissões por tipo de usuário
 * Baseado em docs/development/SPECS.md (linhas 2928-2980)
 */
export const ROLE_PERMISSIONS: Record<UserType, RolePermissions> = {
  [UserType.PROFESSOR]: {
    role: UserType.PROFESSOR,
    permissions: [
      'planos.criar',
      'planos.editar',
      'planos.visualizar',
      'planos.deletar',
      'avaliacoes.criar',
      'avaliacoes.editar',
      'avaliacoes.visualizar',
    ],
    restrictions: {
      apenas_proprios_planos: true,
      pode_visualizar_compartilhados: true,
    },
  },
  [UserType.COORDENADOR]: {
    role: UserType.COORDENADOR,
    permissions: [
      'planos.visualizar',
      'planos.comentar',
      'planos.aprovar',
      'planos.bloquear',
      'professores.visualizar',
      'professores.atribuir_turmas',
      'relatorios.gerar',
      'relatorios.exportar',
    ],
    restrictions: {
      nao_pode_editar_conteudo: true,
      requer_justificativa_bloqueio: true,
    },
  },
  [UserType.SUPERVISOR]: {
    role: UserType.SUPERVISOR,
    permissions: [
      'planos.visualizar',
      'planos.comentar',
      'planos.aprovar',
      'planos.bloquear',
      'professores.visualizar',
      'relatorios.gerar',
      'relatorios.exportar',
    ],
    restrictions: {
      nao_pode_editar_conteudo: true,
      requer_justificativa_bloqueio: true,
    },
  },
  [UserType.DIRETOR]: {
    role: UserType.DIRETOR,
    permissions: [
      'planos.visualizar',
      'planos.aprovar',
      'planos.bloquear',
      'configuracoes.editar',
      'calendario.definir',
      'metas_bncc.estabelecer',
      'professores.visualizar',
      'professores.atribuir_turmas',
      'relatorios.gerar',
      'relatorios.exportar',
    ],
  },
  [UserType.ADMIN]: {
    role: UserType.ADMIN,
    permissions: [
      'planos.criar',
      'planos.editar',
      'planos.visualizar',
      'planos.deletar',
      'planos.aprovar',
      'planos.bloquear',
      'planos.comentar',
      'avaliacoes.criar',
      'avaliacoes.editar',
      'avaliacoes.visualizar',
      'professores.visualizar',
      'professores.atribuir_turmas',
      'relatorios.gerar',
      'relatorios.exportar',
      'configuracoes.editar',
      'calendario.definir',
      'metas_bncc.estabelecer',
    ],
  },
};

// ============================================================================
// Mapeamento de Rotas por Role
// ============================================================================

/**
 * Define quais roles podem acessar cada rota protegida
 */
export const ROUTE_PERMISSIONS: Record<string, UserType[]> = {
  '/professor': [UserType.PROFESSOR, UserType.ADMIN],
  '/gestao': [UserType.COORDENADOR, UserType.SUPERVISOR, UserType.DIRETOR, UserType.ADMIN],
  '/supervisao': [UserType.SUPERVISOR, UserType.DIRETOR, UserType.ADMIN],
  '/admin': [UserType.ADMIN],
};

// ============================================================================
// Funções Públicas
// ============================================================================

/**
 * Verifica se um usuário tem uma permissão específica
 * @param userType - Tipo do usuário
 * @param permission - Permissão a verificar
 * @returns true se o usuário tem a permissão
 */
export function hasPermission(userType: UserType, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userType];
  return rolePermissions.permissions.includes(permission);
}

/**
 * Verifica se um usuário tem pelo menos uma das permissões
 * @param userType - Tipo do usuário
 * @param permissions - Array de permissões
 * @returns true se o usuário tem qualquer uma das permissões
 */
export function hasAnyPermission(userType: UserType, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userType, permission));
}

/**
 * Verifica se um usuário tem todas as permissões
 * @param userType - Tipo do usuário
 * @param permissions - Array de permissões
 * @returns true se o usuário tem todas as permissões
 */
export function hasAllPermissions(userType: UserType, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userType, permission));
}

/**
 * Verifica se um role pode acessar uma rota
 * @param userType - Tipo do usuário
 * @param route - Caminho da rota
 * @returns true se o role pode acessar a rota
 */
export function canAccessRoute(userType: UserType, route: string): boolean {
  // Encontrar o padrão de rota que corresponde
  for (const [routePattern, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (route.startsWith(routePattern)) {
      return allowedRoles.includes(userType);
    }
  }

  // Se não houver restrição específica, permitir acesso
  return true;
}

/**
 * Obtém todas as rotas acessíveis por um role
 * @param userType - Tipo do usuário
 * @returns Array de rotas acessíveis
 */
export function getRoutesByRole(userType: UserType): string[] {
  return Object.entries(ROUTE_PERMISSIONS)
    .filter(([, allowedRoles]) => allowedRoles.includes(userType))
    .map(([route]) => route);
}

/**
 * Obtém todas as permissões de um role
 * @param userType - Tipo do usuário
 * @returns Array de permissões
 */
export function getPermissionsByRole(userType: UserType): Permission[] {
  return ROLE_PERMISSIONS[userType].permissions;
}

/**
 * Obtém restrições de um role
 * @param userType - Tipo do usuário
 * @returns Objeto com restrições ou undefined
 */
export function getRoleRestrictions(userType: UserType): Record<string, boolean> | undefined {
  return ROLE_PERMISSIONS[userType].restrictions;
}

/**
 * Verifica se um role tem uma restrição específica
 * @param userType - Tipo do usuário
 * @param restriction - Nome da restrição
 * @returns true se a restrição está ativa
 */
export function hasRestriction(userType: UserType, restriction: string): boolean {
  const restrictions = getRoleRestrictions(userType);
  return restrictions?.[restriction] === true;
}

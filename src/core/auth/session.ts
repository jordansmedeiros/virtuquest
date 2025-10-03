/**
 * Gerenciamento de sessão server-side
 * @module core/auth/session
 */

import { verifyToken } from './jwt';
import { getAuthCookies } from './cookies';
import type { SessionUser, SessionData, UserType } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Classes de Erro
// ============================================================================

export class UnauthorizedError extends Error {
  constructor(message = 'Não autenticado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Acesso negado') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// ============================================================================
// Funções Públicas
// ============================================================================

/**
 * Obtém a sessão atual do usuário autenticado
 * @returns Dados da sessão ou null se não autenticado
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const { accessToken, refreshToken } = await getAuthCookies();

    if (!accessToken) {
      return null;
    }

    // Validar access token
    const payload = await verifyToken(accessToken, 'access');

    if (!payload) {
      return null;
    }

    // Construir SessionData
    return {
      user: payload.user,
      token: accessToken,
      refreshToken: refreshToken || '',
      expiresAt: payload.exp,
    };
  } catch (error) {
    console.error('[Session] Error getting session:', error);
    return null;
  }
}

/**
 * Obtém apenas os dados do usuário atual
 * @returns Dados do usuário ou null se não autenticado
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Garante que há uma sessão válida (throw se não houver)
 * @throws {UnauthorizedError} Se não houver sessão válida
 * @returns Dados da sessão
 */
export async function requireSession(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    throw new UnauthorizedError();
  }

  return session;
}

/**
 * Garante que há um usuário autenticado (throw se não houver)
 * @throws {UnauthorizedError} Se não houver usuário autenticado
 * @returns Dados do usuário
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await requireSession();
  return session.user;
}

/**
 * Garante que o usuário tem um dos roles permitidos
 * @param allowedRoles - Array de roles permitidos
 * @throws {UnauthorizedError} Se não autenticado
 * @throws {ForbiddenError} Se não tem permissão
 * @returns Dados do usuário
 */
export async function requireRole(allowedRoles: UserType[]): Promise<SessionUser> {
  const user = await requireUser();

  if (!allowedRoles.includes(user.tipo)) {
    throw new ForbiddenError(`Acesso negado. Roles permitidos: ${allowedRoles.join(', ')}`);
  }

  return user;
}

/**
 * Verifica se há uma sessão válida (boolean)
 * @returns true se autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Verifica se o usuário tem um role específico
 * @param requiredRole - Role requerido
 * @returns true se o usuário tem o role
 */
export async function hasRole(requiredRole: UserType): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.tipo === requiredRole;
}

/**
 * Verifica se o usuário tem qualquer um dos roles
 * @param roles - Array de roles
 * @returns true se o usuário tem algum dos roles
 */
export async function hasAnyRole(roles: UserType[]): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? roles.includes(user.tipo) : false;
}

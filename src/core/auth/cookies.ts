/**
 * Utilit de gerenciamento de cookies HttpOnly para autenticação
 * @module core/auth/cookies
 */

import { cookies } from 'next/headers';

// ============================================================================
// Constantes
// ============================================================================

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'virtuquest_access_token',
  REFRESH_TOKEN: 'virtuquest_refresh_token',
  USER_ID: 'virtuquest_user_id',
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// Tempos de expiração (em segundos)
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutos
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 dias

// ============================================================================
// Funções Públicas
// ============================================================================

/**
 * Grava tokens de autenticação em cookies HttpOnly
 * @param accessToken - Access token JWT
 * @param refreshToken - Refresh token JWT
 * @param userId - ID do usuário
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  userId: string
): Promise<void> {
  const cookieStore = await cookies();

  // Gravar access token (15 minutos)
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  // Gravar refresh token (7 dias)
  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  // Gravar user ID (não sensível, útil para SSR)
  cookieStore.set(COOKIE_NAMES.USER_ID, userId, {
    httpOnly: false, // Pode ser lido no cliente para UI
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    path: COOKIE_OPTIONS.path,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

/**
 * Lê tokens de autenticação dos cookies
 * @returns Objeto com tokens ou null se não existirem
 */
export async function getAuthCookies(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
}> {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value || null,
    refreshToken: cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value || null,
    userId: cookieStore.get(COOKIE_NAMES.USER_ID)?.value || null,
  };
}

/**
 * Remove todos os cookies de autenticação
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
  cookieStore.delete(COOKIE_NAMES.USER_ID);
}

/**
 * Obtém apenas o access token
 * @returns Access token ou null
 */
export async function getAccessToken(): Promise<string | null> {
  const { accessToken } = await getAuthCookies();
  return accessToken;
}

/**
 * Obtém apenas o refresh token
 * @returns Refresh token ou null
 */
export async function getRefreshToken(): Promise<string | null> {
  const { refreshToken } = await getAuthCookies();
  return refreshToken;
}

/**
 * Atualiza apenas o access token (usado no refresh)
 * @param accessToken - Novo access token
 */
export async function updateAccessToken(accessToken: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
}

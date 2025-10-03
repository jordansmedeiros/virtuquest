/**
 * Utilit token JWT
 * @module core/auth/jwt
 */

import { jwtVerify, SignJWT } from 'jose';
import { env } from '@/lib/env';
import type { SessionUser } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Interfaces
// ============================================================================

export interface JWTPayload {
  sub: string; // userId
  user: SessionUser;
  iat: number; // issued at
  exp: number; // expiration
  type: 'access' | 'refresh';
}

// ============================================================================
// Constantes
// ============================================================================

const JWT_ACCESS_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const JWT_REFRESH_SECRET = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

// ============================================================================
// Funções Públicas
// ============================================================================

/**
 * Valida e decodifica um JWT
 * @param token - Token JWT a ser validado
 * @param type - Tipo do token (access ou refresh)
 * @returns Payload do token ou null se inválido
 */
export async function verifyToken(
  token: string,
  type: 'access' | 'refresh' = 'access'
): Promise<JWTPayload | null> {
  try {
    const secret = type === 'access' ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET;

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    // Verificar se o tipo no payload corresponde ao esperado
    if (payload.type !== type) {
      console.warn(`[JWT] Token type mismatch: expected ${type}, got ${payload.type}`);
      return null;
    }

    return payload as unknown as JWTPayload;
  } catch (error) {
    if (error instanceof Error) {
      // Logar erros específicos para debugging
      if (error.name === 'JWTExpired') {
        console.debug('[JWT] Token expired');
      } else if (error.name === 'JWSSignatureVerificationFailed') {
        console.warn('[JWT] Invalid token signature');
      } else {
        console.error('[JWT] Verification error:', error.message);
      }
    }
    return null;
  }
}

/**
 * Decodifica um JWT sem validar assinatura (útil para debugging)
 * ATENÇÃO: Não use para validação de segurança!
 * @param token - Token JWT
 * @returns Payload decodificado ou null se inválido
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));

    return decoded as JWTPayload;
  } catch (error) {
    console.error('[JWT] Decode error:', error);
    return null;
  }
}

/**
 * Verifica se um token está expirado
 * @param token - Token JWT
 * @returns true se expirado
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Obtém timestamp de expiração do token
 * @param token - Token JWT
 * @returns Timestamp de expiração (segundos) ou null
 */
export function getTokenExpiration(token: string): number | null {
  const payload = decodeToken(token);
  return payload?.exp || null;
}

/**
 * Gera um novo JWT (usado internamente, N8N normalmente gera tokens)
 * @param user - Dados do usuário
 * @param type - Tipo do token
 * @param expiresIn - Tempo de expiração em segundos
 * @returns Token JWT gerado
 */
export async function generateToken(
  user: SessionUser,
  type: 'access' | 'refresh',
  expiresIn: number
): Promise<string> {
  const secret = type === 'access' ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET;

  const token = await new SignJWT({
    user,
    type,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(secret);

  return token;
}

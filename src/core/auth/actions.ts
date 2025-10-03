/**
 * Server Actions para autenticação
 * @module core/auth/actions
 */

'use server';

import { redirect } from 'next/navigation';
import { n8nClient } from '@/core/infrastructure/n8n';
import { setAuthCookies, clearAuthCookies, getRefreshToken } from './cookies';
import { verifyToken } from './jwt';
import { getCurrentUser as getSessionUser } from './session';
import type { AuthUserRequest, SessionUser, EventType } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Types
// ============================================================================

interface ActionResult {
  success: boolean;
  error?: string;
}

// ============================================================================
// Login Action
// ============================================================================

/**
 * Realiza login do usuário e grava cookies
 * @param credentials - Credenciais de login
 * @returns Resultado da operação
 */
export async function loginAction(credentials: AuthUserRequest): Promise<ActionResult> {
  try {
    // Validar inputs
    if (!credentials.email || !credentials.senha) {
      return {
        success: false,
        error: 'Email e senha são obrigatórios',
      };
    }

    // Chamar N8N para autenticar
    const authResponse = await n8nClient.authenticateUser(credentials);

    // Extrair tokens e userId
    const { token, refreshToken, usuario } = authResponse;

    // Gravar cookies
    await setAuthCookies(token, refreshToken, usuario.id);

    // Registrar evento de telemetria (fire-and-forget)
    recordAuthEvent('LOGIN', usuario.id).catch((error) => {
      console.error('[Auth] Failed to record login event:', error);
    });

    return { success: true };
  } catch (error) {
    console.error('[Auth] Login error:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Erro ao fazer login. Verifique suas credenciais.',
    };
  }
}

// ============================================================================
// Logout Action
// ============================================================================

/**
 * Realiza logout do usuário e limpa cookies
 */
export async function logoutAction(): Promise<void> {
  try {
    // Obter refresh token
    const refreshToken = await getRefreshToken();

    // Obter userId da sessão
    const user = await getSessionUser();
    const userId = user?.id || '';

    // Chamar N8N para invalidar tokens (se houver)
    if (refreshToken && userId) {
      await n8nClient.logout({ userId, refreshToken }).catch((error) => {
        console.error('[Auth] Logout N8N error:', error);
        // Continuar mesmo com erro (limpar cookies localmente)
      });
    }

    // Registrar evento de telemetria (fire-and-forget)
    if (userId) {
      recordAuthEvent('LOGOUT', userId).catch((error) => {
        console.error('[Auth] Failed to record logout event:', error);
      });
    }

    // Limpar cookies
    await clearAuthCookies();
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    // Garantir que cookies sejam limpos mesmo com erro
    await clearAuthCookies();
  }

  // Redirecionar para login
  redirect('/login');
}

// ============================================================================
// Refresh Token Action
// ============================================================================

/**
 * Renova o access token usando refresh token
 * @returns Resultado da operação
 */
export async function refreshTokenAction(): Promise<ActionResult> {
  try {
    // Obter refresh token
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token',
      };
    }

    // Validar refresh token
    const payload = await verifyToken(refreshToken, 'refresh');

    if (!payload) {
      await clearAuthCookies();
      return {
        success: false,
        error: 'Invalid refresh token',
      };
    }

    // Chamar N8N para renovar token
    const response = await n8nClient.refreshToken({ refreshToken });

    // Atualizar cookies
    await setAuthCookies(response.token, response.refreshToken, payload.user.id);

    // Registrar evento de telemetria (fire-and-forget)
    recordAuthEvent('TOKEN_REFRESHED', payload.user.id).catch((error) => {
      console.error('[Auth] Failed to record refresh event:', error);
    });

    return { success: true };
  } catch (error) {
    console.error('[Auth] Refresh token error:', error);

    // Limpar cookies se refresh falhou
    await clearAuthCookies();

    return {
      success: false,
      error: 'Failed to refresh token',
    };
  }
}

// ============================================================================
// Get Current User Action
// ============================================================================

/**
 * Obtém dados do usuário atual (para cliente)
 * @returns Dados do usuário ou null
 */
export async function getCurrentUserAction(): Promise<SessionUser | null> {
  try {
    return await getSessionUser();
  } catch (error) {
    console.error('[Auth] Get current user error:', error);
    return null;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Registra evento de autenticação na telemetria
 * @param tipo - Tipo de evento
 * @param userId - ID do usuário
 */
async function recordAuthEvent(
  tipo: 'LOGIN' | 'LOGOUT' | 'TOKEN_REFRESHED',
  userId: string
): Promise<void> {
  try {
    // Mapear tipo para EventType
    let eventType: EventType;
    switch (tipo) {
      case 'LOGIN':
        eventType = 'login' as EventType;
        break;
      case 'LOGOUT':
        eventType = 'logout' as EventType;
        break;
      case 'TOKEN_REFRESHED':
        eventType = 'token_refreshed' as EventType;
        break;
    }

    // Enviar evento para telemetria pedagógica N8N
    await n8nClient.recordPedagogicalEvent({
      tipo: eventType,
      contexto: {
        usuario: userId,
        timestamp: new Date().toISOString(),
      },
      dados: {
        eventType: tipo,
        timestamp: Date.now(),
      },
    });

    console.debug(`[Auth] Recorded ${tipo} event for user ${userId}`);
  } catch (error) {
    console.error('[Auth] Failed to record event:', error);
    // Fire-and-forget: não propagar erro
  }
}

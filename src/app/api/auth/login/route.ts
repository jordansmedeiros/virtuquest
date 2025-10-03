/**
 * API Route para autenticação de usuários
 * @module app/api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { n8nClient } from '@/core/infrastructure/n8n';
import { setAuthCookies } from '@/core/auth/cookies';
import { generateToken } from '@/core/auth/jwt';
import { isDevModeEnabled, isDevUserCredentials, getDevUser } from '@/core/auth/dev-user';

/**
 * POST /api/auth/login
 * Autentica usuário e retorna tokens
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // ========================================================================
    // MODO DESENVOLVIMENTO - Usuário Hardcoded
    // ========================================================================
    if (isDevModeEnabled() && isDevUserCredentials(email, password)) {
      console.log('[DEV] Using hardcoded dev user');

      const devUser = getDevUser();

      // Gerar tokens localmente
      const accessToken = await generateToken(devUser, 'access', 15 * 60); // 15 minutos
      const refreshToken = await generateToken(devUser, 'refresh', 7 * 24 * 60 * 60); // 7 dias

      // Gravar tokens em cookies
      await setAuthCookies(accessToken, refreshToken, devUser.id);

      return NextResponse.json({
        success: true,
        user: devUser,
        token: accessToken,
        refreshToken: refreshToken,
        expiresIn: 15 * 60,
        devMode: true,
      });
    }

    // ========================================================================
    // MODO PRODUÇÃO - Autenticação via N8N
    // ========================================================================

    // Chamar N8N para autenticação
    const response = await n8nClient.authenticateUser({
      email,
      senha: password,
    });

    // Gravar tokens em cookies
    await setAuthCookies(response.token, response.refreshToken, response.usuario.id);

    // Retornar resposta
    return NextResponse.json({
      success: true,
      user: response.usuario,
      token: response.token,
      refreshToken: response.refreshToken,
    });
  } catch (error) {
    console.error('[API] Login error:', error);

    // Retornar erro apropriado
    if (error instanceof Error && error.message.includes('Invalid credentials')) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

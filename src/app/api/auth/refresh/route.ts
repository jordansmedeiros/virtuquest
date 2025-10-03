/**
 * API Route para refresh de tokens
 * @module app/api/auth/refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import { n8nClient } from '@/core/infrastructure/n8n';
import { verifyToken } from '@/core/auth/jwt';
import { setAuthCookies } from '@/core/auth/cookies';

/**
 * POST /api/auth/refresh
 * Renova access token usando refresh token
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear body
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    // Validar refresh token
    const payload = await verifyToken(refreshToken, 'refresh');

    if (!payload) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Chamar N8N para refresh
    const response = await n8nClient.refreshToken({ refreshToken });

    // Gravar novos tokens em cookies
    await setAuthCookies(response.token, response.refreshToken, payload.user.id);

    // Retornar novo access token
    return NextResponse.json({
      token: response.token,
      expiresIn: response.expiresIn,
    });
  } catch (error) {
    console.error('[API] Refresh token error:', error);

    return NextResponse.json(
      {
        error: 'Failed to refresh token',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

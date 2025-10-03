/**
 * API Route para obter usuário atual
 * @module app/api/auth/me
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/core/auth/session';

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[API] Get current user error:', error);

    return NextResponse.json(
      {
        error: 'Failed to get current user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

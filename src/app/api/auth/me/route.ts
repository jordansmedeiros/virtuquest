/**
 * API Route para obter usuário atual
 * @module app/api/auth/me
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/core/auth/session';

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado ou null
 * Usado por useCurrentUser hook para hidratação client-side
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    // Retornar 200 com user null ao invés de 401 para facilitar consumo client-side
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('[API] Get current user error:', error);

    // Em caso de erro, retornar user null
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

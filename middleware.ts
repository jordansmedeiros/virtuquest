/**
 * Next.js Middleware para proteção de rotas e refresh automático de tokens
 * @module middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/core/auth/jwt';
import { COOKIE_NAMES } from '@/core/auth/cookies';
import { canAccessRoute } from '@/core/auth/permissions';
import { UserType } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Constantes
// ============================================================================

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/'];
const AUTH_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = ['/professor', '/gestao', '/supervisao', '/admin'];

// ============================================================================
// Middleware
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rotas públicas (exceto home)
  const isPublicRoute = PUBLIC_ROUTES.some((route) => route !== '/' && pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Obter tokens dos cookies
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

  // Se é rota de auth e usuário já está autenticado, redirecionar
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && accessToken) {
    const payload = await verifyToken(accessToken);
    if (payload) {
      const redirectUrl = getDefaultRouteByRole(payload.user.tipo);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Verificar se é rota protegida
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Se não há token, redirecionar para login
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validar access token
  let payload = await verifyToken(accessToken);

  // Se token expirado, tentar refresh
  if (!payload && refreshToken) {
    const refreshPayload = await verifyToken(refreshToken, 'refresh');

    if (refreshPayload) {
      try {
        // Fazer refresh via fetch interno
        const refreshResponse = await fetch(new URL('/api/auth/refresh', request.url), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const { token: newAccessToken } = await refreshResponse.json();

          // Criar response com novo token
          const response = NextResponse.next();
          response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60, // 15 minutos
          });

          // Validar novo token
          payload = await verifyToken(newAccessToken);

          if (payload) {
            // Adicionar headers com dados do usuário
            response.headers.set('x-user-id', payload.user.id);
            response.headers.set('x-user-type', payload.user.tipo);
            return response;
          }
        }
      } catch (error) {
        console.error('[Middleware] Refresh error:', error);
      }
    }

    // Refresh falhou, redirecionar para login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar autorização RBAC
  if (payload) {
    const userType = payload.user.tipo;
    const hasAccess = canAccessRoute(userType, pathname);

    if (!hasAccess) {
      // Redirecionar para página de acesso negado
      return NextResponse.redirect(new URL('/403', request.url));
    }

    // Adicionar headers com dados do usuário (para Server Components)
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.user.id);
    response.headers.set('x-user-type', payload.user.tipo);

    return response;
  }

  // Fallback - redirecionar para login
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Obtém rota padrão baseada no role do usuário
 */
function getDefaultRouteByRole(userType: UserType): string {
  switch (userType) {
    case UserType.PROFESSOR:
      return '/professor';
    case UserType.COORDENADOR:
    case UserType.SUPERVISOR:
    case UserType.DIRETOR:
      return '/gestao';
    case UserType.ADMIN:
      return '/admin';
    default:
      return '/';
  }
}

// ============================================================================
// Configuração
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

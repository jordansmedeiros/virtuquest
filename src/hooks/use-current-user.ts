/**
 * Hook para gerenciar usuário atual
 * @module hooks/use-current-user
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import type { SessionUser } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Hook Principal
// ============================================================================

/**
 * Hook para obter dados do usuário atual
 * Sincroniza com cookies HttpOnly via API endpoint
 */
export function useCurrentUser(): {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
} {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  // Função para buscar usuário via API
  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Incluir cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData as SessionUser);
      } else if (response.status === 401) {
        // Não autenticado
        setUser(null);
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('[useCurrentUser] Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Carregar usuário na montagem (se não estiver no store)
  useEffect(() => {
    if (!user && !isLoading) {
      fetchUser();
    } else if (user) {
      // Se já tem user no store, ainda sincronizar (mas não mostrar loading)
      fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return null;
        })
        .then((userData) => {
          if (userData && userData.id !== user.id) {
            setUser(userData as SessionUser);
          }
        })
        .catch((error) => {
          console.error('[useCurrentUser] Sync error:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch: fetchUser,
  };
}

// ============================================================================
// Hooks Especializados
// ============================================================================

/**
 * Garante autenticação (redirect se não autenticado)
 */
export function useRequireAuth(): SessionUser | null {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null;
  }

  return user;
}

/**
 * Garante role específico (redirect se não autorizado)
 */
export function useRequireRole(allowedRoles: string[]): SessionUser | null {
  const router = useRouter();
  const user = useRequireAuth();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.tipo)) {
      router.push('/403');
    }
  }, [user, allowedRoles, router]);

  if (!user) {
    return null;
  }

  if (!allowedRoles.includes(user.tipo)) {
    return null;
  }

  return user;
}

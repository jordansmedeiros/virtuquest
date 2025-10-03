/**
 * Zustand store para gerenciamento de estado de autenticação
 * @module stores/auth-store
 */

'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { SessionUser } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Interface
// ============================================================================

interface AuthState {
  // Estado
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Ações
  setUser: (user: SessionUser | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;

  // Helpers
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
}

// ============================================================================
// Store
// ============================================================================

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: null,
        isAuthenticated: false,
        isLoading: true,

        // Ações
        setUser: (user) =>
          set({
            user,
            isAuthenticated: user !== null,
            isLoading: false,
          }),

        clearUser: () =>
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }),

        setLoading: (loading) => set({ isLoading: loading }),

        // Helpers
        hasPermission: (permission) => {
          const { user } = get();
          if (!user) return false;
          return user.permissoes?.includes(permission) ?? false;
        },

        hasRole: (roles) => {
          const { user } = get();
          if (!user) return false;
          return roles.includes(user.tipo);
        },
      }),
      {
        name: 'virtuquest-auth',
        partialize: (state) => ({
          // Persistir apenas user (não tokens - eles ficam em cookies HttpOnly)
          user: state.user,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// ============================================================================
// Seletores
// ============================================================================

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);

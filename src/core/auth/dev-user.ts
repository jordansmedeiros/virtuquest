/**
 * Usuário hardcoded para desenvolvimento (somente quando N8N não está disponível)
 * @module core/auth/dev-user
 */

import { UserType, type SessionUser } from '@/core/infrastructure/n8n/types';

// ============================================================================
// Constantes de Desenvolvimento
// ============================================================================

export const DEV_USER_CREDENTIALS = {
  email: 'dev@virtuquest.local',
  password: 'dev123',
} as const;

export const DEV_USER: SessionUser = {
  id: 'dev-user-001',
  nome: 'Usuário Desenvolvimento',
  email: DEV_USER_CREDENTIALS.email,
  tipo: UserType.PROFESSOR,
  instituicaoId: 'dev-instituicao-001',
  instituicaoNome: 'Instituição de Desenvolvimento',
  ativo: true,
  permissoes: ['planejar', 'visualizar', 'editar'],
};

// ============================================================================
// Funções de Desenvolvimento
// ============================================================================

/**
 * Verifica se as credenciais correspondem ao usuário de desenvolvimento
 */
export function isDevUserCredentials(email: string, password: string): boolean {
  return email === DEV_USER_CREDENTIALS.email && password === DEV_USER_CREDENTIALS.password;
}

/**
 * Retorna o usuário de desenvolvimento
 */
export function getDevUser(): SessionUser {
  return DEV_USER;
}

/**
 * Verifica se modo de desenvolvimento está habilitado
 */
export function isDevModeEnabled(): boolean {
  // Modo dev está habilitado se:
  // 1. Estamos em desenvolvimento (NODE_ENV)
  // 2. Debug mode está ativo
  // 3. N8N está em modo mock
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' &&
    process.env.NEXT_PUBLIC_MOCK_N8N === 'true'
  );
}

// ============================================================================
// Exports
// ============================================================================

export default {
  DEV_USER_CREDENTIALS,
  DEV_USER,
  isDevUserCredentials,
  getDevUser,
  isDevModeEnabled,
};

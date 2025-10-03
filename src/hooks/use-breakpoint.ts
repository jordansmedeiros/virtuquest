/**
 * Hook useBreakpoint - VirtuQuest Design System
 *
 * Hook para detectar breakpoints responsivos
 * Conforme especificado em SPECS.md seção 11.7
 */

'use client';

import { useMediaQuery } from './use-media-query';
import type { Breakpoints, UseBreakpointReturn } from '@/types/theme';

/**
 * Breakpoints do sistema conforme Tailwind CSS
 */
export const breakpoints: Breakpoints = {
  sm: '640px', // Mobile landscape
  md: '768px', // Tablet
  lg: '1024px', // Desktop
  xl: '1280px', // Large desktop
  '2xl': '1536px', // Extra large
};

/**
 * Hook para detectar breakpoints responsivos
 *
 * @returns Objeto com informações sobre breakpoints ativos
 *
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop, breakpoint, isAbove, isBelow } = useBreakpoint();
 *
 * // Usar flags booleanas
 * if (isMobile) {
 *   return <MobileComponent />;
 * }
 *
 * // Usar funções de comparação
 * if (isAbove('md')) {
 *   return <TabletAndUpComponent />;
 * }
 *
 * // Obter breakpoint atual
 * console.log('Current breakpoint:', breakpoint); // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null
 * ```
 */
export function useBreakpoint(): UseBreakpointReturn {
  // Media queries para cada breakpoint
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const is2Xl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`);

  // Aliases semânticos para facilitar o uso
  const isMobile = !isSm; // Menor que sm
  const isTablet = isSm && !isLg; // Entre sm e lg
  const isDesktop = isLg; // lg ou maior
  const isLargeDesktop = isXl; // xl ou maior
  const isExtraLarge = is2Xl; // 2xl ou maior

  // Determinar o breakpoint atual (maior breakpoint ativo)
  const getCurrentBreakpoint = (): keyof Breakpoints | null => {
    if (is2Xl) return '2xl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return null; // Menor que sm
  };

  const breakpoint = getCurrentBreakpoint();

  // Função para verificar se está acima de um breakpoint
  const isAbove = (bp: keyof Breakpoints): boolean => {
    const breakpointOrder: (keyof Breakpoints)[] = ['sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpoint ? breakpointOrder.indexOf(breakpoint) : -1;
    const targetIndex = breakpointOrder.indexOf(bp);

    return currentIndex >= targetIndex;
  };

  // Função para verificar se está abaixo de um breakpoint
  const isBelow = (bp: keyof Breakpoints): boolean => {
    const breakpointOrder: (keyof Breakpoints)[] = ['sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpoint ? breakpointOrder.indexOf(breakpoint) : -1;
    const targetIndex = breakpointOrder.indexOf(bp);

    return currentIndex < targetIndex;
  };

  return {
    // Flags booleanas
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isExtraLarge,

    // Breakpoint atual
    breakpoint,

    // Funções de comparação
    isAbove,
    isBelow,
  };
}

/**
 * Hook simplificado para verificar se está em um dispositivo móvel
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${breakpoints.sm})`);
}

/**
 * Hook simplificado para verificar se está em um tablet
 */
export function useIsTablet(): boolean {
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  return isSm && !isLg;
}

/**
 * Hook simplificado para verificar se está em um desktop
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.lg})`);
}

/**
 * Hook para detectar orientação do dispositivo
 */
export function useOrientation(): 'portrait' | 'landscape' | undefined {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  if (isPortrait) return 'portrait';
  if (isLandscape) return 'landscape';
  return undefined;
}

/**
 * Hook para detectar preferências de acessibilidade
 */
export function useAccessibilityPreferences() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return {
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
  };
}

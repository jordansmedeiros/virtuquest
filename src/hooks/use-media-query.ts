/**
 * Hook useMediaQuery - VirtuQuest Design System
 *
 * Hook para detectar mudanças em media queries
 * Conforme especificado em SPECS.md seção 11.7
 */

'use client';

import { useEffect, useState } from 'react';
import type { UseMediaQueryOptions } from '@/types/theme';

/**
 * Hook para detectar mudanças em media queries
 *
 * @param query - Media query string (ex: '(min-width: 768px)')
 * @param options - Opções de configuração
 * @returns boolean indicando se a media query está ativa
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 640px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 * ```
 */
export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
  const {
    defaultMatches = false,
    matchMedia = typeof window !== 'undefined' ? window.matchMedia : undefined,
  } = options;

  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultMatches;
    }

    if (!matchMedia) {
      return defaultMatches;
    }

    return matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !matchMedia) {
      return;
    }

    const mediaQueryList = matchMedia(query);

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, matchMedia]);

  return matches;
}

/**
 * ThemeProvider - VirtuQuest Design System
 *
 * Provider de tema que gerencia estado do tema, esquema de cores e tamanho da fonte
 * com persistência no localStorage conforme SPECS.md seção 11.8.1
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type {
  Theme,
  ColorScheme,
  FontSize,
  ThemeConfig,
  ThemeProviderState,
  ThemeProviderProps,
} from '@/types/theme';

const STORAGE_KEYS = {
  theme: 'virtuquest-theme',
  colorScheme: 'virtuquest-color-scheme',
  fontSize: 'virtuquest-font-size',
} as const;

const DEFAULT_CONFIG: ThemeConfig = {
  theme: 'system',
  colorScheme: 'default',
  fontSize: 'normal',
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children, config = {} }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(config.theme ?? DEFAULT_CONFIG.theme);
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    config.colorScheme ?? DEFAULT_CONFIG.colorScheme
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(
    config.fontSize ?? DEFAULT_CONFIG.fontSize
  );
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) as Theme;
      const savedColorScheme = localStorage.getItem(STORAGE_KEYS.colorScheme) as ColorScheme;
      const savedFontSize = localStorage.getItem(STORAGE_KEYS.fontSize) as FontSize;

      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
      if (
        savedColorScheme &&
        ['default', 'high-contrast', 'daltonism'].includes(savedColorScheme)
      ) {
        setColorSchemeState(savedColorScheme);
      }
      if (savedFontSize && ['normal', 'large', 'extra-large'].includes(savedFontSize)) {
        setFontSizeState(savedFontSize);
      }
    } catch (error) {
      console.warn('Erro ao carregar configurações de tema do localStorage:', error);
    }

    setMounted(true);
  }, []);

  // Resolver tema system para light/dark
  useEffect(() => {
    if (!mounted) return;

    const resolveSystemTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        setResolvedTheme(systemTheme);
      } else {
        setResolvedTheme(theme);
      }
    };

    resolveSystemTheme();

    // Listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        resolveSystemTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Aplicar tema ao DOM
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // Remover classes de tema existentes
    root.classList.remove('light', 'dark');

    // Aplicar tema resolvido
    root.classList.add(resolvedTheme);

    // Aplicar esquema de cores
    root.setAttribute('data-color-scheme', colorScheme);

    // Aplicar tamanho de fonte
    root.setAttribute('data-font-size', fontSize);

    // Aplicar variáveis CSS customizadas se necessário
    if (colorScheme !== 'default') {
      root.style.setProperty('--theme-transition', 'none');
      // Forçar recálculo de estilos
      root.offsetHeight;
      root.style.removeProperty('--theme-transition');
    }
  }, [resolvedTheme, colorScheme, fontSize, mounted]);

  // Funções para atualizar configurações
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, newTheme);
    } catch (error) {
      console.warn('Erro ao salvar tema no localStorage:', error);
    }
  };

  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
    try {
      localStorage.setItem(STORAGE_KEYS.colorScheme, newColorScheme);
    } catch (error) {
      console.warn('Erro ao salvar esquema de cores no localStorage:', error);
    }
  };

  const setFontSize = (newFontSize: FontSize) => {
    setFontSizeState(newFontSize);
    try {
      localStorage.setItem(STORAGE_KEYS.fontSize, newFontSize);
    } catch (error) {
      console.warn('Erro ao salvar tamanho de fonte no localStorage:', error);
    }
  };

  const value: ThemeProviderState = {
    theme,
    colorScheme,
    fontSize,
    resolvedTheme,
    setTheme,
    setColorScheme,
    setFontSize,
  };

  // Evitar hidration mismatch renderizando um loading state até mounted
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider value={value}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeProviderContext.Provider>
    );
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

// Hook para usar o contexto do tema
export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }

  return context;
}

// Hook para verificar se está no modo escuro
export function useIsDark() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
}

// Hook para obter configuração completa do tema
export function useThemeConfig(): ThemeConfig {
  const { theme, colorScheme, fontSize } = useTheme();
  return { theme, colorScheme, fontSize };
}

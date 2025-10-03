/**
 * Tipos TypeScript para o Sistema de Temas - VirtuQuest
 *
 * Conforme especificado em SPECS.md seção 11.8
 */

export type Theme = 'light' | 'dark' | 'system';

export type ColorScheme = 'default' | 'high-contrast' | 'daltonism';

export type FontSize = 'normal' | 'large' | 'extra-large';

export interface ThemeConfig {
  theme: Theme;
  colorScheme: ColorScheme;
  fontSize: FontSize;
}

export interface ThemeProviderState extends ThemeConfig {
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setFontSize: (size: FontSize) => void;
  resolvedTheme: 'light' | 'dark'; // Tema resolvido (system -> light/dark)
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  config?: Partial<ThemeConfig>;
  storageKey?: string;
}

// Breakpoints para responsividade
export interface Breakpoints {
  sm: string; // 640px - Mobile landscape
  md: string; // 768px - Tablet
  lg: string; // 1024px - Desktop
  xl: string; // 1280px - Large desktop
  '2xl': string; // 1536px - Extra large
}

export interface MediaQueries {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isExtraLarge: boolean;
}

// Design Tokens estruturados
export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    destructive: string;
    warning: string;
    success: string;
    border: string;
    input: string;
    ring: string;
  };

  educational: {
    bncc: {
      competencia: string;
      habilidade: string;
      objetoConhecimento: string;
    };
    bloom: {
      lembrar: string;
      compreender: string;
      aplicar: string;
      analisar: string;
      avaliar: string;
      criar: string;
    };
    virtudes: {
      curiosidade: string;
      humildade: string;
      coragem: string;
      autonomia: string;
    };
    status: {
      rascunho: string;
      emRevisao: string;
      pendenteAprovacao: string;
      aprovado: string;
      bloqueado: string;
      publicado: string;
    };
  };

  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };

  typography: {
    fontSans: string;
    fontMono: string;
    fontEducational: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    lineHeights: {
      none: number;
      tight: number;
      snug: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
  };

  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };

  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    educational: string;
  };

  animations: {
    fast: string;
    base: string;
    slow: string;
    slower: string;
    easing: {
      linear: string;
      in: string;
      out: string;
      inOut: string;
    };
  };
}

// Configurações específicas para contexto educacional
export interface EducationalThemeConfig {
  showBloomColors: boolean;
  showBNCCBadges: boolean;
  showVirtueIndicators: boolean;
  emphasizeAccessibility: boolean;
  useEducationalFonts: boolean;
}

// Hook configurations
export interface UseMediaQueryOptions {
  defaultMatches?: boolean;
  matchMedia?: typeof window.matchMedia;
}

export interface UseBreakpointReturn extends MediaQueries {
  breakpoint: keyof Breakpoints | null;
  isAbove: (breakpoint: keyof Breakpoints) => boolean;
  isBelow: (breakpoint: keyof Breakpoints) => boolean;
}

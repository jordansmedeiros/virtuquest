import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', 'class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        bncc: {
          competencia: 'hsl(var(--bncc-competencia))',
          habilidade: 'hsl(var(--bncc-habilidade))',
        },
        bloom: {
          lembrar: 'hsl(var(--bloom-lembrar))',
          entender: 'hsl(var(--bloom-entender))',
          aplicar: 'hsl(var(--bloom-aplicar))',
          analisar: 'hsl(var(--bloom-analisar))',
          avaliar: 'hsl(var(--bloom-avaliar))',
          criar: 'hsl(var(--bloom-criar))',
        },
        virtude: {
          curiosidade: 'hsl(var(--virtude-curiosidade))',
          humildade: 'hsl(var(--virtude-humildade))',
          coragem: 'hsl(var(--virtude-coragem))',
          autonomia: 'hsl(var(--virtude-autonomia))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        educational: ['var(--font-educational)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: 'var(--spacing-xs, 0.5rem)',
        sm: 'var(--spacing-sm, 1rem)',
        md: 'var(--spacing-md, 1.5rem)',
        lg: 'var(--spacing-lg, 2rem)',
        xl: 'var(--spacing-xl, 3rem)',
        '2xl': 'var(--spacing-2xl, 4rem)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

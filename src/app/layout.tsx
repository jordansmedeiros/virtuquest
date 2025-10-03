import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/providers/theme-provider';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-educational',
  display: 'swap',
});

// Metadata configuration
export const metadata: Metadata = {
  title: {
    default: 'VirtuQuest - Planejamento Pedagógico Integrado',
    template: '%s | VirtuQuest',
  },
  description: 'Sistema de Planejamento Pedagógico Integrado BNCC-Bloom-Virtudes',
  keywords: [
    'BNCC',
    'Bloom',
    'planejamento pedagógico',
    'virtudes intelectuais',
    'educação',
    'taxonomia',
    'competências',
    'habilidades',
  ],
  authors: [{ name: 'Equipe VirtuQuest' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(222.2 47.4% 11.2%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(210 40% 98%)' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

// Root layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${lexend.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

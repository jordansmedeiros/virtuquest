import type { Metadata } from 'next';

// Temporary page component with placeholder content
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="mx-auto max-w-4xl text-center">
        {/* Logo/Title */}
        <h1 className="mb-4 text-6xl font-bold text-indigo-900">VirtuQuest</h1>

        {/* Subtitle */}
        <p className="mb-8 text-xl text-indigo-700">Sistema de Planejamento Pedagógico Integrado</p>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-2 text-2xl text-green-600">✅</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Alinhamento BNCC</h3>
            <p className="text-gray-600">
              Competências e habilidades da Base Nacional Comum Curricular
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-2 text-2xl text-green-600">✅</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Taxonomia de Bloom</h3>
            <p className="text-gray-600">
              Processos cognitivos estruturados para aprendizagem efetiva
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-2 text-2xl text-green-600">✅</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Virtudes Intelectuais</h3>
            <p className="text-gray-600">Desenvolvimento do caráter e pensamento crítico</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-2 text-2xl text-green-600">✅</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Integração com IA</h3>
            <p className="text-gray-600">
              Assistente pedagógico inteligente para otimizar o planejamento
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/login"
            className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Entrar
          </a>
          <a
            href="/about"
            className="rounded-lg border-2 border-indigo-600 bg-white px-8 py-3 font-semibold text-indigo-600 transition-colors hover:bg-gray-50"
          >
            Saber Mais
          </a>
        </div>

        {/* TODO Notice */}
        <div className="mt-12 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Página Temporária:</strong> Esta é uma página de boas-vindas temporária. Será
            substituída pelo fluxo de autenticação adequado na Fase 1.
          </p>
        </div>
      </div>
    </div>
  );
}

// Page-specific metadata
export const metadata: Metadata = {
  title: 'VirtuQuest - Planejamento Pedagógico Integrado',
  description:
    'Plataforma completa para planejamento pedagógico com integração BNCC, Taxonomia de Bloom e Virtudes Intelectuais. Otimize seu ensino com IA.',
};

/*
TODO for Phase 1:
- Replace with proper authentication flow
- Implement redirect logic for authenticated users to /professor or /gestao based on role
- Consider implementing redirect logic in middleware
- Add proper landing page design with theme provider
*/

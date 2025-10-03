import type { Metadata } from 'next';

// Temporary page component with placeholder content
export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo/Title */}
        <h1 className="text-6xl font-bold text-indigo-900 mb-4">
          VirtuQuest
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-indigo-700 mb-8">
          Sistema de Planejamento Pedagógico Integrado
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-green-600 text-2xl mb-2">✅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Alinhamento BNCC</h3>
            <p className="text-gray-600">Competências e habilidades da Base Nacional Comum Curricular</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-green-600 text-2xl mb-2">✅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Taxonomia de Bloom</h3>
            <p className="text-gray-600">Processos cognitivos estruturados para aprendizagem efetiva</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-green-600 text-2xl mb-2">✅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Virtudes Intelectuais</h3>
            <p className="text-gray-600">Desenvolvimento do caráter e pensamento crítico</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-green-600 text-2xl mb-2">✅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Integração com IA</h3>
            <p className="text-gray-600">Assistente pedagógico inteligente para otimizar o planejamento</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Entrar
          </a>
          <a
            href="/about"
            className="bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-3 px-8 rounded-lg border-2 border-indigo-600 transition-colors"
          >
            Saber Mais
          </a>
        </div>

        {/* TODO Notice */}
        <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Página Temporária:</strong> Esta é uma página de boas-vindas temporária. 
            Será substituída pelo fluxo de autenticação adequado na Fase 1.
          </p>
        </div>
      </div>
    </div>
  );
}

// Page-specific metadata
export const metadata: Metadata = {
  title: 'VirtuQuest - Planejamento Pedagógico Integrado',
  description: 'Plataforma completa para planejamento pedagógico com integração BNCC, Taxonomia de Bloom e Virtudes Intelectuais. Otimize seu ensino com IA.',
};

/*
TODO for Phase 1:
- Replace with proper authentication flow
- Implement redirect logic for authenticated users to /professor or /gestao based on role
- Consider implementing redirect logic in middleware
- Add proper landing page design with theme provider
*/
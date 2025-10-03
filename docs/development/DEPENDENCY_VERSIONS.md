# Dependency Versions - VirtuQuest

Este documento lista todas as versões de dependências confirmadas e pendentes para revisão da equipe.

## ✅ Versões Confirmadas (Estáveis - Outubro 2025)

- **Next.js**: 15.5.4
- **React**: 19.x (empacotado com Next.js 15)
- **TypeScript**: 5.9.3
- **lucide-react**: 0.544.0
- **react-hook-form**: 7.63.0
- **@hookform/resolvers**: 5.2.2
- **zustand**: 5.0.8
- **immer**: 10.1.3
- **ESLint**: 9.36.0
- **eslint-config-next**: 15.5.2
- **Prettier**: 3.6.2
- **Husky**: 9.1.7

## ⚠️ REQUER CONFIRMAÇÃO DA EQUIPE (Mudanças Incompatíveis das Specs)

### **Tailwind CSS:**
- **Specs mencionam**: `3.4+`
- **Último estável**: `4.1.13` (v4 lançado em Jan 2025, v3.4.17 EOL)
- **Mudanças incompatíveis**: Novo formato de config, abordagem CSS-first
- **Recomendação**: Usar v4.1.13 (atual) ou fixar em v3.4.17 (EOL)
- **Decisão necessária**: Qual versão?

### **framer-motion:**
- **Specs mencionam**: `11+`
- **Último estável**: `12.23.12`
- **Nota**: v12 tem mudanças de API do v11
- **Recomendação**: Usar v12.23.12 (atual)
- **Decisão necessária**: Confirmar compatibilidade v12

### **recharts:**
- **Specs mencionam**: `2.7+`
- **Último estável**: `3.2.1` (v2.15.4 é o último 2.x)
- **Mudanças incompatíveis**: v3 tem nova API e melhorias no TypeScript
- **Recomendação**: Usar v3.2.1 (atual) ou fixar em v2.15.4
- **Decisão necessária**: Qual versão?

### **zod:**
- **Specs mencionam**: `3+`
- **Último estável**: `4.1.11`
- **Mudanças incompatíveis**: v4 tem inferência de tipo mais rigorosa
- **Recomendação**: Usar v4.1.11 (atual)
- **Decisão necessária**: Confirmar compatibilidade v4

## 📦 Dependências Adicionais (Não nas Specs)

- **@radix-ui/react-\***: Versões compatíveis mais recentes (via shadcn/ui)
- **class-variance-authority**: Mais recente (para shadcn/ui)
- **clsx**: Mais recente (para utilitários de className)
- **tailwind-merge**: Mais recente (para merge de className)
- **date-fns**: Mais recente (para utilitários de data)

## 🔧 Ferramentas de Desenvolvimento

- **@types/node**: Mais recente para definições de tipo Node.js
- **@types/react**: 19.x (compatível com React 19)
- **@types/react-dom**: 19.x
- **eslint-plugin-react-hooks**: Mais recente
- **eslint-plugin-jsx-a11y**: Mais recente (acessibilidade)
- **prettier-plugin-tailwindcss**: Mais recente (ordenação de classes Tailwind)
- **lint-staged**: Mais recente (para Husky pre-commit)
- **@commitlint/cli**: Mais recente (Conventional Commits)
- **@commitlint/config-conventional**: Mais recente

## 📝 Notas

1. Todas as versões verificadas contra o registro npm em 3 de outubro de 2025
2. shadcn/ui é compatível com Next.js 15 + React 19 + Tailwind v4
3. Next.js 15.5.4 requer React 19.x (empacotado)
4. ESLint 9 usa formato de config flat (mudança incompatível do v8)
5. Middleware do Zustand (persist, devtools, immer) estão inclusos no pacote zustand

## 🎯 Ação Recomendada

A equipe deve revisar e aprovar as versões marcadas com ⚠️ antes de prosseguir com a instalação. Documentar decisões neste arquivo.

## 📋 Estado das Decisões

| Dependência | Versão Decidida | Status | Data da Decisão |
|-------------|----------------|--------|-----------------|
| Tailwind CSS | - | ⏳ Pendente | - |
| framer-motion | - | ⏳ Pendente | - |
| recharts | - | ⏳ Pendente | - |
| zod | - | ⏳ Pendente | - |

**Última atualização**: 3 de outubro de 2025
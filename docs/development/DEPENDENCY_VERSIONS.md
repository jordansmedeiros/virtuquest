# Versões das Dependências - VirtuQuest

Este documento rastreia as versões das dependências do projeto e documenta
decisões sobre atualizações e compatibilidade.

## 📦 Status Atual das Dependências

### Dependências Principais

| Pacote         | Versão Atual | Versão Estável | EOL/Status | Decisão      |
| -------------- | ------------ | -------------- | ---------- | ------------ |
| **Next.js**    | 15.5.4       | 15.5.4         | ✅ Ativa   | ✅ Confirmar |
| **React**      | 19.0.0       | 19.0.0         | ✅ Ativa   | ✅ Confirmar |
| **TypeScript** | 5.9.3        | 5.9.3          | ✅ Ativa   | ✅ Confirmar |

### Dependências com Mudanças Incompatíveis

| Pacote            | Versão Atual | Alternativa | Status                   | Decisão Pendente |
| ----------------- | ------------ | ----------- | ------------------------ | ---------------- |
| **Tailwind CSS**  | 4.1.13       | 3.4.17      | v4 é alpha/beta          | ⚠️ **REVISAR**   |
| **Recharts**      | 3.2.1        | 2.15.4      | v3 com breaking changes  | ⚠️ **REVISAR**   |
| **Framer Motion** | 12.23.12     | 11.x        | v12 com breaking changes | ⚠️ **REVISAR**   |
| **Zod**           | 4.1.11       | 3.x         | v4 com breaking changes  | ⚠️ **REVISAR**   |

### Ferramentas de Desenvolvimento

| Pacote         | Versão Atual | Status   | Nota        |
| -------------- | ------------ | -------- | ----------- |
| **ESLint**     | 9.36.0       | ✅ Ativa | Flat config |
| **Prettier**   | 3.6.2        | ✅ Ativa | -           |
| **Husky**      | 9.1.7        | ✅ Ativa | -           |
| **Commitlint** | 19.6.1       | ✅ Ativa | -           |

## 🔍 Análise de Compatibilidade

### Tailwind CSS v4 vs v3

- **v4.1.13 (atual)**: Versão moderna, mas ainda em desenvolvimento
- **v3.4.17**: Versão estável e madura, mas EOL planejado
- **Recomendação**: Manter v4 para projeto moderno, mas monitorar estabilidade

### Recharts v3 vs v2

- **v3.2.1 (atual)**: Novas funcionalidades, melhor performance
- **v2.15.4**: Estável, mas sem novos recursos
- **Recomendação**: Manter v3 para funcionalidades modernas

### Framer Motion v12 vs v11

- **v12.23.12 (atual)**: Performance melhorada, novas APIs
- **v11.x**: Estável, mas sem novas funcionalidades
- **Recomendação**: Manter v12 para melhor performance

### Zod v4 vs v3

- **v4.1.11 (atual)**: Melhor performance, novas funcionalidades
- **v3.x**: Estável e amplamente usado
- **Recomendação**: Manter v4 para projeto moderno

## ✅ Decisões Finais

**Data da Última Revisão**: 3 de outubro de 2025

### Dependências Confirmadas:

- ✅ **Tailwind CSS**: v4.1.13 (mantendo versão moderna)
- ✅ **Recharts**: v3.2.1 (mantendo para funcionalidades atuais)
- ✅ **Framer Motion**: v12.23.12 (mantendo para performance)
- ✅ **Zod**: v4.1.11 (mantendo para compatibilidade moderna)

### Justificativas:

1. **Projeto moderno**: Priorizamos versões atuais para longevidade
2. **Performance**: Versões mais recentes oferecem melhor performance
3. **Funcionalidades**: Versões atuais têm recursos necessários para o projeto
4. **Suporte**: Mantemos compatibilidade com React 19 e Next.js 15

## 🚨 Avisos e Considerações

### npm com React 19

Se usar npm e encontrar avisos de peer dependency:

```bash
npm install --legacy-peer-deps
```

### Monitoramento

- Acompanhar estabilidade do Tailwind CSS v4
- Verificar atualizações de segurança mensalmente
- Documentar quebras de compatibilidade em atualizações

## 📝 Log de Mudanças

### 2025-10-03

- Configuração inicial do projeto
- Definição de versões para Fase 1
- Todas as dependências principais confirmadas

---

**Nota**: Este documento deve ser atualizado sempre que versões de dependências
forem alteradas ou quando decisões sobre compatibilidade forem tomadas.

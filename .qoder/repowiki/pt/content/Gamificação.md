# Gamificação

<cite>
**Arquivos Referenciados neste Documento**   
- [env.ts](file://src/lib/env.ts)
- [README.md](file://README.md)
</cite>

## Sumário

1. [Introdução](#introdução)
2. [Controle por Feature Flag](#controle-por-feature-flag)
3. [Arquitetura de Gamificação](#arquitetura-de-gamificação)
4. [Sincronização com N8N](#sincronização-com-n8n)
5. [Práticas Recomendadas](#práticas-recomendadas)

## Introdução

O sistema de gamificação do VirtuQuest foi projetado para motivar professores
através de um modelo de recompensas baseado em pontos, níveis e conquistas
(badges). Este sistema incentiva a adoção de boas práticas pedagógicas, como a
conclusão de planos de aula alinhados à BNCC e o uso estratégico da inteligência
artificial no planejamento educacional. A gamificação é implementada como um
sistema opcional, controlado por uma feature flag, permitindo ativação
progressiva e testes A/B.

## Controle por Feature Flag

O sistema de gamificação é controlado pela feature flag
`NEXT_PUBLIC_ENABLE_GAMIFICATION`, definida nas variáveis de ambiente do
cliente. Essa abordagem permite:

- Ativação/desativação sem necessidade de deploy
- Implantação gradual para grupos específicos de usuários
- Testes de usabilidade com subconjuntos de professores
- Desativação imediata em caso de problemas

A feature flag é validada no arquivo de configuração de ambiente, onde seu valor
padrão é `false`, indicando que a gamificação está desativada por padrão em
novas instalações.

**Fontes da seção**

- [env.ts](file://src/lib/env.ts#L29-L87)
- [README.md](file://README.md#L168-L216)

## Arquitetura de Gamificação

O sistema de gamificação é estruturado em três pilares principais: pontos,
níveis e badges, cada um contribuindo para diferentes aspectos da motivação
docente.

### Sistema de Pontos

Os pontos são atribuídos por ações pedagógicas significativas, como:

- Conclusão de planos de aula
- Uso de sugestões de IA no planejamento
- Alinhamento com múltiplos domínios (BNCC, Bloom, Virtudes)
- Compartilhamento de planos com colegas

A pontuação é acumulativa e visível no painel do professor, servindo como
métrica de engajamento e produtividade.

### Sistema de Níveis

Os níveis representam o progresso contínuo do professor na plataforma,
funcionando como marcos de desenvolvimento profissional. Cada nível alcançado
desbloqueia:

- Novos recursos da plataforma
- Reconhecimento visual no perfil
- Acesso a conteúdos exclusivos
- Oportunidades de liderança entre pares

### Sistema de Badges

As badges (conquistas) são recompensas por conquistas específicas e memoráveis,
como:

- "Primeiro Plano": ao criar o primeiro plano de aula
- "Explorador de IA": ao utilizar o assistente de IA em 10 planos
- "Alinhador Mestre": ao alinhar um plano com todos os domínios pedagógicos
- "Inovador Pedagógico": ao receber elogios de colegas por planos compartilhados

**Fontes da seção**

- [README.md](file://README.md#L0-L44)
- [env.ts](file://src/lib/env.ts#L29-L87)

## Sincronização com N8N

A arquitetura de gamificação integra-se com o backend através do N8N, uma
plataforma de automação de fluxos de trabalho. Esta integração ocorre via
webhooks, garantindo:

- Processamento assíncrono de eventos de gamificação
- Sincronização confiável mesmo em modo offline
- Registro auditável de todas as transações de pontos
- Integração com sistemas de reconhecimento institucional

Os eventos de gamificação são disparados quando:

- Um plano de aula é concluído com sucesso
- Uma sugestão de IA é aceita e implementada
- Um plano é aprovado pelo gestor escolar
- Um professor atinge um novo nível

A URL da instância N8N é configurada através da variável de ambiente
`N8N_BASE_URL`, com segurança garantida pelo `N8N_WEBHOOK_SECRET`.

**Fontes da seção**

- [env.ts](file://src/lib/env.ts#L0-L30)
- [README.md](file://README.md#L168-L216)

## Práticas Recomendadas

Para garantir que a gamificação mantenha seu foco pedagógico sem extrinsecidade
excessiva, recomenda-se:

### Alinhamento com Objetivos Educacionais

As recompensas devem estar diretamente ligadas a práticas que melhorem a
qualidade do ensino, nunca incentivando métricas vazias ou atividades sem valor
pedagógico real.

### Progressão Significativa

Os níveis e badges devem representar conquistas autênticas no desenvolvimento
profissional docente, evitando gamificação superficial que desvirtue o propósito
educacional.

### Transparência no Sistema

Os critérios para ganhar pontos e conquistas devem ser claros e acessíveis,
promovendo equidade e compreensão do sistema por todos os professores.

### Foco no Desenvolvimento Profissional

A gamificação deve servir como ferramenta de desenvolvimento profissional
contínuo, destacando conquistas que representem crescimento real na prática
pedagógica.

**Fontes da seção**

- [README.md](file://README.md#L261-L277)
- [env.ts](file://src/lib/env.ts#L29-L87)

Análise da Estrutura de Dados Persistentes - VirtuQuest

1. Tabelas Nativas do N8N (Aproveitamento) Tabelas Principais do N8N que serão
   utilizadas: workflow_entity - Armazenará workflows de processamento
   pedagógico execution_entity - Log de execuções dos workflows execution_data -
   Dados de execução detalhados user - Base para usuários do sistema variables -
   Variáveis globais do sistema webhook_entity - Webhooks para integração
2. Entidades de Domínio do VirtuQuest A. Entidades Pedagógicas (Catálogos
   Estáticos) Competências Gerais BNCC (10) Competências Específicas BNCC
   Habilidades BNCC Objetos de Conhecimento Células Taxonômicas Bloom (24)
   Virtudes Intelectuais (6 core) Situações-Problema Perrenoud Recursos
   Cognitivos B. Entidades de Planejamento Planos de Aula Integrados Momentos
   Didáticos Atividades Pedagógicas Recursos Didáticos Instrumentos Avaliativos
   C. Entidades de Sistema Usuários (Professor, Coordenador, Supervisor,
   Diretor, Admin) Escolas Turmas Sessões de Autenticação Eventos de Telemetria
3. Definições das Tabelas A. Tabelas de Usuários e Autenticação sql -- Extensão
   da tabela nativa 'user' do N8N CREATE TABLE virtuquest_users ( id UUID
   PRIMARY KEY DEFAULT gen_random_uuid(), n8n_user_id UUID REFERENCES user(id),
   -- FK para tabela nativa do N8N nome VARCHAR(255) NOT NULL, email
   VARCHAR(255) UNIQUE NOT NULL, tipo user_type NOT NULL, escola_id UUID
   REFERENCES escolas(id), disciplinas TEXT[], -- Array de disciplinas
   permissoes TEXT[], -- Array de permissões RBAC created_at TIMESTAMP DEFAULT
   NOW(), updated_at TIMESTAMP DEFAULT NOW() );

CREATE TYPE user_type AS ENUM ( 'PROFESSOR', 'COORDENADOR', 'SUPERVISOR',
'DIRETOR', 'ADMIN' );

CREATE TABLE escolas ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), nome
VARCHAR(255) NOT NULL, codigo_inep VARCHAR(8) UNIQUE, endereco JSONB, contato
JSONB, configuracoes JSONB, created_at TIMESTAMP DEFAULT NOW(), updated_at
TIMESTAMP DEFAULT NOW() );

CREATE TABLE sessoes_auth ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES virtuquest_users(id), token_hash VARCHAR(512) NOT NULL,
refresh_token_hash VARCHAR(512), expires_at TIMESTAMP NOT NULL, created_at
TIMESTAMP DEFAULT NOW(), revogado BOOLEAN DEFAULT FALSE ); B. Tabelas de
Catálogos Pedagógicos (Seed Data) sql -- Competências Gerais BNCC (10
competências) CREATE TABLE competencias_gerais_bncc ( id UUID PRIMARY KEY
DEFAULT gen_random_uuid(), codigo INTEGER UNIQUE NOT NULL CHECK (codigo BETWEEN
1 AND 10), descricao TEXT NOT NULL, dimensoes JSONB NOT NULL, -- {conhecimentos,
habilidades, atitudes, valores} created_at TIMESTAMP DEFAULT NOW() );

-- Competências Específicas por Área CREATE TABLE competencias_especificas_bncc
( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), competencia_geral_id UUID
REFERENCES competencias_gerais_bncc(id), area_conhecimento area_conhecimento NOT
NULL, componente_curricular componente_curricular, descricao TEXT NOT NULL,
created_at TIMESTAMP DEFAULT NOW() );

CREATE TYPE area_conhecimento AS ENUM ( 'LINGUAGENS', 'MATEMATICA',
'CIENCIAS_NATUREZA', 'CIENCIAS_HUMANAS', 'ENSINO_RELIGIOSO' );

CREATE TYPE componente_curricular AS ENUM ( 'LINGUA_PORTUGUESA', 'ARTE',
'EDUCACAO_FISICA', 'LINGUA_INGLESA', 'MATEMATICA', 'CIENCIAS', 'GEOGRAFIA',
'HISTORIA', 'ENSINO_RELIGIOSO' );

-- Objetos de Conhecimento CREATE TABLE objetos_conhecimento ( id UUID PRIMARY
KEY DEFAULT gen_random_uuid(), nome VARCHAR(255) NOT NULL, descricao TEXT,
campo_experiencia VARCHAR(255), -- Para Educação Infantil unidade_tematica
VARCHAR(255), -- Para Ensino Fundamental created_at TIMESTAMP DEFAULT NOW() );

-- Habilidades BNCC CREATE TABLE habilidades_bncc ( id UUID PRIMARY KEY DEFAULT
gen_random_uuid(), codigo VARCHAR(20) UNIQUE NOT NULL, -- Ex: EF67LP08
competencia_especifica_id UUID REFERENCES competencias_especificas_bncc(id),
descricao TEXT NOT NULL, etapa etapa_ensino NOT NULL, ano VARCHAR(10) NOT NULL,
-- Ex: '67' para 6º e 7º ano componente VARCHAR(10) NOT NULL, -- Ex: 'LP'
sequencia INTEGER NOT NULL, created_at TIMESTAMP DEFAULT NOW() );

CREATE TYPE etapa_ensino AS ENUM ('EI', 'EF', 'EM');

-- Relação M:N entre Habilidades e Objetos de Conhecimento CREATE TABLE
habilidades_objetos_conhecimento ( habilidade_id UUID REFERENCES
habilidades_bncc(id), objeto_conhecimento_id UUID REFERENCES
objetos_conhecimento(id), PRIMARY KEY (habilidade_id, objeto_conhecimento_id) );

-- Matriz Taxonômica de Bloom (24 células) CREATE TABLE
celulas_taxonomicas_bloom ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
codigo VARCHAR(3) UNIQUE NOT NULL, -- A1 até D6 processo_cognitivo INTEGER NOT
NULL CHECK (processo_cognitivo BETWEEN 1 AND 6), tipo_conhecimento CHAR(1) NOT
NULL CHECK (tipo_conhecimento IN ('A','B','C','D')), descricao TEXT NOT NULL,
exemplos_contextualizados TEXT[], verbos_caracteristicos TEXT[], created_at
TIMESTAMP DEFAULT NOW() );

-- Virtudes Intelectuais (6 core) CREATE TABLE virtudes_intelectuais ( id UUID
PRIMARY KEY DEFAULT gen_random_uuid(), nome VARCHAR(255) UNIQUE NOT NULL, -- Ex:
CURIOSIDADE_INTELECTUAL categoria categoria_virtude NOT NULL, definicao TEXT NOT
NULL, indicadores JSONB NOT NULL, -- Array de indicadores observáveis
processos_bloom_relacionados INTEGER[], competencias_bncc_relacionadas
INTEGER[], nivel_desenvolvimento JSONB NOT NULL, -- {inicial, intermediario,
avancado} created_at TIMESTAMP DEFAULT NOW() );

CREATE TYPE categoria_virtude AS ENUM ('epistemica', 'moral', 'pratica');

-- Situações-Problema (Perrenoud) CREATE TABLE situacoes_problema ( id UUID
PRIMARY KEY DEFAULT gen_random_uuid(), competencia_id UUID, -- Referência
flexível contexto TEXT NOT NULL, enunciado TEXT NOT NULL, complexidade
complexidade_situacao NOT NULL, autenticidade BOOLEAN NOT NULL, abertura
abertura_situacao NOT NULL, multiplas_solucoes BOOLEAN NOT NULL,
recursos_necessarios TEXT[], processos_requeridos INTEGER[], momento
momento_didatico NOT NULL, created_at TIMESTAMP DEFAULT NOW() );

CREATE TYPE complexidade_situacao AS ENUM ('simples', 'intermediaria',
'complexa'); CREATE TYPE abertura_situacao AS ENUM ('fechada', 'semi-aberta',
'aberta'); CREATE TYPE momento_didatico AS ENUM ('apropriacao',
'aplicacao_guiada', 'analise_avaliacao', 'criacao'); C. Tabelas de Planejamento
Pedagógico sql -- Metadados de Planos CREATE TABLE planos_aula ( id UUID PRIMARY
KEY DEFAULT gen_random_uuid(), titulo VARCHAR(255) NOT NULL, descricao TEXT,
disciplina VARCHAR(100) NOT NULL, serie VARCHAR(50) NOT NULL, turma VARCHAR(50),
professor_id UUID REFERENCES virtuquest_users(id), escola_id UUID REFERENCES
escolas(id), nivel hierarquia_planejamento NOT NULL, status plan_status NOT NULL
DEFAULT 'rascunho', duracao INTEGER NOT NULL, -- minutos data_execucao DATE,
versao INTEGER DEFAULT 1, pai_id UUID REFERENCES planos_aula(id), -- Para
hierarquia created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT
NOW() );

CREATE TYPE hierarquia_planejamento AS ENUM ('ano', 'semestre', 'bimestre',
'unidade', 'aula'); CREATE TYPE plan_status AS ENUM ('rascunho', 'em_revisao',
'aprovado', 'rejeitado', 'arquivado');

-- Alinhamento BNCC do Plano CREATE TABLE planos_competencias_gerais ( plano_id
UUID REFERENCES planos_aula(id), competencia_geral_codigo INTEGER REFERENCES
competencias_gerais_bncc(codigo), PRIMARY KEY (plano_id,
competencia_geral_codigo) );

CREATE TABLE planos_competencias_especificas ( plano_id UUID REFERENCES
planos_aula(id), competencia_especifica_id UUID REFERENCES
competencias_especificas_bncc(id), PRIMARY KEY (plano_id,
competencia_especifica_id) );

CREATE TABLE planos_habilidades ( plano_id UUID REFERENCES planos_aula(id),
habilidade_id UUID REFERENCES habilidades_bncc(id), PRIMARY KEY (plano_id,
habilidade_id) );

-- Alinhamento Bloom do Plano CREATE TABLE planos_celulas_bloom ( plano_id UUID
REFERENCES planos_aula(id), celula_id UUID REFERENCES
celulas_taxonomicas_bloom(id), tipo bloom_mapping_type NOT NULL, -- principal,
secundaria PRIMARY KEY (plano_id, celula_id) );

CREATE TYPE bloom_mapping_type AS ENUM ('principal', 'secundaria');

-- Virtudes do Plano CREATE TABLE planos_virtudes ( plano_id UUID REFERENCES
planos_aula(id), virtude_id UUID REFERENCES virtudes_intelectuais(id),
estrategias TEXT[], indicadores_observaveis TEXT[], momentos_trabalho INTEGER[],
PRIMARY KEY (plano_id, virtude_id) );

-- Momentos Didáticos CREATE TABLE momentos_didaticos ( id UUID PRIMARY KEY
DEFAULT gen_random_uuid(), plano_id UUID REFERENCES planos_aula(id), ordem
INTEGER NOT NULL, nome VARCHAR(255) NOT NULL, tipo momento_didatico NOT NULL,
duracao INTEGER NOT NULL, -- minutos observacoes TEXT, created_at TIMESTAMP
DEFAULT NOW() );

-- Atividades Pedagógicas CREATE TABLE atividades_pedagogicas ( id UUID PRIMARY
KEY DEFAULT gen_random_uuid(), momento_id UUID REFERENCES
momentos_didaticos(id), nome VARCHAR(255) NOT NULL, descricao TEXT, duracao
INTEGER NOT NULL, -- minutos tipo tipo_atividade NOT NULL, processos_bloom
INTEGER[], instrucoes TEXT, created_at TIMESTAMP DEFAULT NOW() );

CREATE TYPE tipo_atividade AS ENUM ('individual', 'grupo', 'coletiva');

-- Recursos Didáticos CREATE TABLE recursos_didaticos ( id UUID PRIMARY KEY
DEFAULT gen_random_uuid(), nome VARCHAR(255) NOT NULL, tipo tipo_recurso NOT
NULL, descricao TEXT, disponibilidade disponibilidade_recurso NOT NULL,
quantidade INTEGER, created_at TIMESTAMP DEFAULT NOW() );

CREATE TYPE tipo_recurso AS ENUM ('material', 'tecnologico', 'espacial',
'humano'); CREATE TYPE disponibilidade_recurso AS ENUM ('disponivel',
'solicitar', 'indisponivel');

-- Recursos utilizados em Atividades CREATE TABLE atividades_recursos (
atividade_id UUID REFERENCES atividades_pedagogicas(id), recurso_id UUID
REFERENCES recursos_didaticos(id), quantidade INTEGER DEFAULT 1, PRIMARY KEY
(atividade_id, recurso_id) );

-- Instrumentos Avaliativos CREATE TABLE instrumentos_avaliativos ( id UUID
PRIMARY KEY DEFAULT gen_random_uuid(), plano_id UUID REFERENCES planos_aula(id),
tipo tipo_instrumento NOT NULL, descricao TEXT, peso DECIMAL(5,2) CHECK (peso
BETWEEN 0 AND 100), criterios TEXT[], processos_bloom INTEGER[], created_at
TIMESTAMP DEFAULT NOW() );

CREATE TYPE tipo_instrumento AS ENUM ( 'prova', 'trabalho', 'apresentacao',
'portfolio', 'observacao', 'autoavaliacao' ); D. Tabelas de Análise e Validação
sql -- Alinhamento Pedagógico (resultado de análise) CREATE TABLE
alinhamentos_pedagogicos ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
plano_id UUID REFERENCES planos_aula(id), coerencia_vertical DECIMAL(5,2) CHECK
(coerencia_vertical BETWEEN 0 AND 100), coerencia_horizontal DECIMAL(5,2) CHECK
(coerencia_horizontal BETWEEN 0 AND 100), gaps TEXT[], recomendacoes TEXT[],
score_qualidade DECIMAL(5,2) CHECK (score_qualidade BETWEEN 0 AND 100),
created_at TIMESTAMP DEFAULT NOW() );

-- Validação de Planos CREATE TABLE validacoes_planos ( id UUID PRIMARY KEY
DEFAULT gen_random_uuid(), plano_id UUID REFERENCES planos_aula(id), valido
BOOLEAN NOT NULL, erros JSONB, -- Array de objetos com erros avisos JSONB, --
Array de objetos com avisos score INTEGER CHECK (score BETWEEN 0 AND 100),
validado_em TIMESTAMP DEFAULT NOW() ); E. Tabelas de Integração com N8N sql --
Aproveitamento da tabela nativa webhook_entity do N8N -- Mapeamento de Workflows
N8N CREATE TABLE workflows_pedagogicos ( id UUID PRIMARY KEY DEFAULT
gen_random_uuid(), n8n_workflow_id UUID NOT NULL, -- FK para workflow_entity do
N8N tipo workflow_type NOT NULL, nome VARCHAR(255) NOT NULL, descricao TEXT,
ativo BOOLEAN DEFAULT TRUE, configuracao JSONB, created_at TIMESTAMP DEFAULT
NOW() );

CREATE TYPE workflow_type AS ENUM ( 'criacao_plano', 'analise_alinhamento',
'geracao_avaliacao', 'sugestao_conteudo', 'validacao_pedagogica' );

-- Log de Execuções (extensão da execution_entity nativa) CREATE TABLE
execucoes_pedagogicas ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
n8n_execution_id UUID NOT NULL, -- FK para execution_entity do N8N
workflow_pedagogico_id UUID REFERENCES workflows_pedagogicos(id), plano_id UUID
REFERENCES planos_aula(id), usuario_id UUID REFERENCES virtuquest_users(id),
status execution_status NOT NULL, entrada JSONB, saida JSONB, tempo_execucao
INTEGER, -- milissegundos created_at TIMESTAMP DEFAULT NOW() );

CREATE TYPE execution_status AS ENUM ('sucesso', 'erro', 'timeout',
'cancelado'); F. Tabelas de Telemetria e Analytics sql -- Eventos Pedagógicos
CREATE TABLE eventos_pedagogicos ( id UUID PRIMARY KEY DEFAULT
gen_random_uuid(), tipo event_type NOT NULL, usuario_id UUID REFERENCES
virtuquest_users(id), escola_id UUID REFERENCES escolas(id), plano_id UUID
REFERENCES planos_aula(id), contexto JSONB NOT NULL, dados JSONB NOT NULL,
timestamp TIMESTAMP DEFAULT NOW() );

CREATE TYPE event_type AS ENUM ( 'plano_criado', 'plano_editado',
'plano_aprovado', 'plano_rejeitado', 'ia_utilizada', 'avaliacao_gerada',
'relatorio_acessado', 'login', 'logout', 'token_refreshed' ); 4. Índices e
Otimizações sql -- Índices para performance CREATE INDEX idx_planos_professor ON
planos_aula(professor_id); CREATE INDEX idx_planos_escola ON
planos_aula(escola_id); CREATE INDEX idx_planos_status ON planos_aula(status);
CREATE INDEX idx_planos_data ON planos_aula(data_execucao); CREATE INDEX
idx_habilidades_codigo ON habilidades_bncc(codigo); CREATE INDEX
idx_eventos_usuario ON eventos_pedagogicos(usuario_id); CREATE INDEX
idx_eventos_timestamp ON eventos_pedagogicos(timestamp); CREATE INDEX
idx_execucoes_workflow ON execucoes_pedagogicas(workflow_pedagogico_id); Updated
To-dos Resumo da Análise Analisei a estrutura de dados persistentes do projeto
VirtuQuest integrando as tabelas nativas do N8N com as entidades específicas do
domínio pedagógico. O projeto utiliza uma arquitetura híbrida que aproveita as
capacidades nativas do N8N para workflows e execuções, complementando com
tabelas específicas para o domínio educacional (BNCC, Bloom, Virtudes e
Perrenoud). A estrutura resultante suporta tanto catálogos pedagógicos estáticos
quanto planejamento dinâmico, com forte foco em alinhamento pedagógico e
validação de coerência.

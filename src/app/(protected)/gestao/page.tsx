/**
 * Dashboard de Gestão (Coordenador, Supervisor, Diretor)
 * @module app/(protected)/gestao/page
 */

import { requireRole } from '@/core/auth/session';
import { UserType } from '@/core/infrastructure/n8n/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function GestaoDashboard() {
  // Garantir que usuário é gestor
  const user = await requireRole([
    UserType.COORDENADOR,
    UserType.SUPERVISOR,
    UserType.DIRETOR,
    UserType.ADMIN,
  ]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Olá, {user.nome}!</h1>
        <p className="text-muted-foreground">Painel de Gestão Pedagógica - {user.tipo}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Planos Pendentes</CardTitle>
            <CardDescription>Aguardando aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">planos para revisar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professores</CardTitle>
            <CardDescription>Total de professores</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">professores ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cobertura BNCC</CardTitle>
            <CardDescription>Progresso geral</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0%</p>
            <p className="text-xs text-muted-foreground">competências cobertas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
            <CardDescription>Análises disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">relatórios gerados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Recentes</CardTitle>
          <CardDescription>Últimas atividades da equipe</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
        </CardContent>
      </Card>
    </div>
  );
}

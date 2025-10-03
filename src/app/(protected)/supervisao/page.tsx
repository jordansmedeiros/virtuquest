/**
 * Dashboard de Supervisão
 * @module app/(protected)/supervisao/page
 */

import { requireRole } from '@/core/auth/session';
import { UserType } from '@/core/infrastructure/n8n/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function SupervisaoDashboard() {
  // Garantir que usuário é supervisor
  const user = await requireRole([UserType.SUPERVISOR, UserType.DIRETOR, UserType.ADMIN]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Olá, {user.nome}!</h1>
        <p className="text-muted-foreground">Painel de Supervisão Pedagógica - {user.tipo}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Escolas</CardTitle>
            <CardDescription>Instituições supervisionadas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">escolas ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planos Revisados</CardTitle>
            <CardDescription>Total este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">planos aprovados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alinhamento BNCC</CardTitle>
            <CardDescription>Média regional</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0%</p>
            <p className="text-xs text-muted-foreground">competências cobertas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auditorias</CardTitle>
            <CardDescription>Pendentes de revisão</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">auditorias agendadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Indicadores Regionais</CardTitle>
            <CardDescription>Desempenho das escolas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhum indicador disponível</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Recentes</CardTitle>
            <CardDescription>Últimas supervisões realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

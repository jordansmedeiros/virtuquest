/**
 * Dashboard de Administração
 * @module app/(protected)/admin/page
 */

import { requireRole } from '@/core/auth/session';
import { UserType } from '@/core/infrastructure/n8n/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function AdminDashboard() {
  // Garantir que usuário é admin
  const user = await requireRole([UserType.ADMIN]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Olá, {user.nome}!</h1>
        <p className="text-muted-foreground">Painel de Administração do Sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Total no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escolas</CardTitle>
            <CardDescription>Instituições ativas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">escolas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planos Totais</CardTitle>
            <CardDescription>Criados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">planos de aula</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de IA</CardTitle>
            <CardDescription>Requisições este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">requisições de IA</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
            <CardDescription>Gerenciar configurações globais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">N8N - Conectado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">Cache - Ativo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">Circuit Breaker - Normal</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs do Sistema</CardTitle>
            <CardDescription>Monitoramento de atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sistema operando normalmente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Dashboard do Professor
 * @module app/(protected)/professor/page
 */

import { requireRole } from '@/core/auth/session';
import { UserType } from '@/core/infrastructure/n8n/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function ProfessorDashboard() {
  // Garantir que usuário é professor
  const user = await requireRole([UserType.PROFESSOR, UserType.ADMIN]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Olá, {user.nome}!</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel do professor</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Planos de Aula</CardTitle>
            <CardDescription>Crie e gerencie seus planos de aula</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">planos criados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações</CardTitle>
            <CardDescription>Gere e aplique avaliações</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">avaliações aplicadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso BNCC</CardTitle>
            <CardDescription>Acompanhe seu progresso</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0%</p>
            <p className="text-xs text-muted-foreground">competências cobertas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>Comece a planejar suas aulas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Crie seu primeiro plano de aula</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <span>Explore os catálogos da BNCC e Bloom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <span>Gere avaliações com IA</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

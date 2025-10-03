/**
 * Página de Login
 * @module app/(auth)/login/page
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { loginAction } from '@/core/auth/actions';

// ============================================================================
// Schema de Validação
// ============================================================================

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// Componente
// ============================================================================

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/professor';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(data);

      if (result.success) {
        // Redirecionar para rota original ou dashboard
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar no VirtuQuest</CardTitle>
        <CardDescription>Sistema de Planejamento Pedagógico Integrado</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              {...register('senha')}
              disabled={isLoading}
            />
            {errors.senha && <p className="text-sm text-destructive">{errors.senha.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Esqueceu sua senha?{' '}
            <a href="/forgot-password" className="text-primary hover:underline">
              Recuperar
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

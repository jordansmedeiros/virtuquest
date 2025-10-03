/**
 * Página de Acesso Negado (403 Forbidden)
 * @module app/403/page
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Acesso Negado</CardTitle>
          <CardDescription className="text-center">
            Você não tem permissão para acessar esta página
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <span className="text-4xl text-destructive">🚫</span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button className="flex-1" onClick={() => router.push('/')}>
            Ir para Início
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

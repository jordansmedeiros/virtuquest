'use client';

import { useState } from 'react';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';

// Educational components
import { BNCCBadge } from '@/components/educational/bncc-badge';
import { BloomIndicator } from '@/components/educational/bloom-indicator';
import { StatusPill } from '@/components/educational/status-pill';
import { PlanoAulaCard } from '@/components/educational/plano-aula-card';

// Mock data
const mockPlanoAula = {
  id: '1',
  titulo: 'Introdução à Matemática',
  disciplina: 'Matemática',
  turma: '1º Ano A',
  data: new Date(),
  duracao: 50,
  status: 'APROVADO' as const,
  competencias: ['COMP01'],
  habilidades: ['EF01MA01'],
  niveisBloom: ['lembrar' as const, 'entender' as const],
  professor: {
    nome: 'Prof. João Silva',
    avatar: '',
  },
  descricao: 'Plano de aula de matemática',
};

export default function DemoPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Demonstração de Componentes</h1>
          <p className="text-muted-foreground">
            Explore os componentes do design system VirtuQuest
          </p>
        </div>
        <ThemeSwitcher />
      </div>

      <Separator />

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges & Pills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <BNCCBadge code="EF01MA01" />
            <BNCCBadge code="EF02CI03" variant="compact" />
          </div>

          <div className="flex flex-wrap gap-2">
            <BloomIndicator nivel="lembrar" />
            <BloomIndicator nivel="entender" />
            <BloomIndicator nivel="aplicar" variant="compact" />
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusPill status="RASCUNHO" />
            <StatusPill status="EM_REVISAO" />
            <StatusPill status="APROVADO" />
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Botões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs & Popovers */}
      <Card>
        <CardHeader>
          <CardTitle>Dialogs & Popovers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Abrir Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Título do Dialog</DialogTitle>
                  <DialogDescription>
                    Descrição do dialog. Aqui você pode adicionar qualquer conteúdo.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Abrir Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Popover</h4>
                  <p className="text-sm text-muted-foreground">
                    Conteúdo do popover pode incluir qualquer elemento.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Dropdown Menu */}
      <Card>
        <CardHeader>
          <CardTitle>Dropdown Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Abrir Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
              <DropdownMenuItem>Item 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* Command Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Command Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <Command className="rounded-lg border">
            <CommandInput placeholder="Digite um comando..." />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup heading="Sugestões">
                <CommandItem>Criar Plano de Aula</CommandItem>
                <CommandItem>Buscar BNCC</CommandItem>
                <CommandItem>Gerenciar Turmas</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tabela</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Plano 1</TableCell>
                <TableCell>Matemática</TableCell>
                <TableCell>1º Ano A</TableCell>
                <TableCell>
                  <StatusPill status="APROVADO" size="sm" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Plano 2</TableCell>
                <TableCell>Português</TableCell>
                <TableCell>2º Ano B</TableCell>
                <TableCell>
                  <StatusPill status="EM_REVISAO" size="sm" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plano de Aula Card */}
      <Card>
        <CardHeader>
          <CardTitle>Plano de Aula Card</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanoAulaCard
            plano={mockPlanoAula}
            onView={(id) => console.log('View:', id)}
            onEdit={(id) => console.log('Edit:', id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

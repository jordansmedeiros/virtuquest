'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Separator,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

// Educational components
import { BNCCBadge } from '@/components/educational/bncc-badge';
import { BloomIndicator } from '@/components/educational/bloom-indicator';
import { StatusPill } from '@/components/educational/status-pill';
import { PlanoAulaCard } from '@/components/educational/plano-aula-card';

// Theme Switcher
import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';

// Mock data
const mockPlanoAula = {
  id: '1',
  titulo: 'Introdução à Matemática',
  disciplina: 'Matemática',
  turma: '1º Ano A',
  serie: '1º Ano',
  duracao: 50,
  status: 'RASCUNHO' as const,
  competencias: ['EF01MA01'], // Simplified to strings as expected by PlanoAula interface
  habilidades: ['EF01MA01'], // Simplified to strings as expected by PlanoAula interface
  niveisBloom: ['lembrar', 'aplicar'] as ['lembrar', 'aplicar'],
  criado: new Date('2024-01-15'),
  atualizado: new Date('2024-01-20'),
};

const tableData = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', role: 'Professor' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', role: 'Coordenador' },
  { id: 3, name: 'Carlos Lima', email: 'carlos@email.com', role: 'Diretor' },
];

export default function DemoPage() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Demo - Componentes shadcn/ui</h1>
        <ThemeSwitcher />
      </div>

      <Separator />

      {/* Basic Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Componentes Básicos</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button>Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Labels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="demo-input">Nome do Professor</Label>
              <input
                id="demo-input"
                className="w-full rounded border p-2"
                placeholder="Digite aqui..."
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Componentes Interativos</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Popover + Command</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {value ? value : 'Selecione uma opção...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandList>
                      <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            setValue('Matemática');
                            setOpen(false);
                          }}
                        >
                          Matemática
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            setValue('Português');
                            setOpen(false);
                          }}
                        >
                          Português
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            setValue('História');
                            setOpen(false);
                          }}
                        >
                          História
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialog & DropdownMenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Abrir Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Título do Dialog</DialogTitle>
                    <DialogDescription>
                      Esta é uma demonstração do componente Dialog do shadcn/ui.
                    </DialogDescription>
                  </DialogHeader>
                  <p>Conteúdo do dialog aqui...</p>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Dropdown Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                  <DropdownMenuItem>Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Table Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tabela</h2>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Educational Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Componentes Educacionais</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Badges Educacionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block text-sm font-medium">BNCC Badge:</Label>
                <BNCCBadge competencia="EF01MA01" />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium">Bloom Indicator:</Label>
                <BloomIndicator nivel="lembrar" />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium">Status Pills:</Label>
                <div className="flex flex-wrap gap-2">
                  <StatusPill status="RASCUNHO" />
                  <StatusPill status="EM_REVISAO" />
                  <StatusPill status="APROVADO" />
                  <StatusPill status="PUBLICADO" />
                  <StatusPill status="BLOQUEADO" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plano de Aula Card</CardTitle>
            </CardHeader>
            <CardContent>
              <PlanoAulaCard
                plano={mockPlanoAula}
                variant="compact"
                onEdit={() => console.log('Edit clicked')}
                onView={() => console.log('View clicked')}
                onDelete={() => console.log('Delete clicked')}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Plano de Aula - Variações</h2>

        <div className="space-y-4">
          <PlanoAulaCard
            plano={mockPlanoAula}
            variant="default"
            onEdit={() => console.log('Edit default')}
          />

          <PlanoAulaCard
            plano={{ ...mockPlanoAula, status: 'PUBLICADO' }}
            variant="detailed"
            onView={() => console.log('View detailed')}
          />
        </div>
      </section>
    </div>
  );
}

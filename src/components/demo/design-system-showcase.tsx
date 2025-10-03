/**
 * Componente de Demonstração do Design System VirtuQuest
 *
 * Mostra todos os componentes implementados funcionando juntos
 */

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { Rating } from '@/components/ui/rating';
import { BNCCBadge } from '@/components/educational/bncc-badge';
import { BloomIndicator } from '@/components/educational/bloom-indicator';
import { StatusPill } from '@/components/educational/status-pill';
import { PlanoAulaCard } from '@/components/educational/plano-aula-card';

// Dados de exemplo
const exemploPlanoAula = {
  id: '1',
  titulo: 'Introdução à Matemática Financeira',
  descricao:
    'Plano de aula focado em conceitos básicos de juros simples e compostos, aplicados ao cotidiano dos alunos.',
  disciplina: 'Matemática',
  turma: '9º Ano A',
  data: new Date('2024-10-15'),
  duracao: 90,
  status: 'APROVADO' as const,
  competencias: ['COMP01'],
  habilidades: ['EF09MA20', 'EF09MA21'],
  niveisBloom: ['APLICAR', 'ANALISAR'] as const,
  professor: {
    nome: 'Prof. Maria Silva',
    avatar: '',
  },
};

const dadosTabela = [
  { id: '1', aluno: 'João Silva', nota: 8.5, status: 'Aprovado' },
  { id: '2', aluno: 'Maria Santos', nota: 9.2, status: 'Aprovado' },
  { id: '3', aluno: 'Pedro Oliveira', nota: 6.8, status: 'Recuperação' },
];

export function DesignSystemShowcase() {
  const [selectedTab, setSelectedTab] = useState('componentes-base');
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(4);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Design System VirtuQuest</h1>
        <p className="text-muted-foreground">Demonstração completa dos componentes implementados</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="componentes-base">Base</TabsTrigger>
          <TabsTrigger value="formularios">Formulários</TabsTrigger>
          <TabsTrigger value="educacionais">Educacionais</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="componentes-base" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Componentes Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badges */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              {/* Buttons */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Botões</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* Spinner e Rating */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Feedback</h3>
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <p className="text-sm">Spinner:</p>
                    <Spinner size="md" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Rating:</p>
                    <Rating value={rating} onRatingChange={setRating} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Loading Demo:</p>
                    <Button onClick={handleLoadingDemo} disabled={isLoading}>
                      {isLoading ? <Spinner size="sm" /> : 'Test Loading'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formularios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Componentes de Formulário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input</label>
                  <Input placeholder="Digite algo..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opcao1">Opção 1</SelectItem>
                      <SelectItem value="opcao2">Opção 2</SelectItem>
                      <SelectItem value="opcao3">Opção 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Textarea</label>
                <Textarea placeholder="Digite uma descrição..." />
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>Abrir Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Exemplo de Dialog</DialogTitle>
                    <DialogDescription>
                      Este é um exemplo de como usar o componente Dialog.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Campo de exemplo" />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancelar</Button>
                      <Button>Confirmar</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="educacionais" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Componentes Educacionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* BNCC Badges */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">BNCC</h3>
                <div className="flex flex-wrap gap-2">
                  <BNCCBadge competencia="COMP01" />
                  <BNCCBadge habilidade="EF09MA20" />
                  <BNCCBadge competencia="COMP05" habilidade="EF67LP28" />
                </div>
              </div>

              {/* Bloom Indicators */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Taxonomia de Bloom</h3>
                <div className="flex flex-wrap gap-2">
                  <BloomIndicator nivel="LEMBRAR" />
                  <BloomIndicator nivel="COMPREENDER" />
                  <BloomIndicator nivel="APLICAR" />
                  <BloomIndicator nivel="ANALISAR" variant="compact" />
                  <BloomIndicator nivel="AVALIAR" variant="compact" />
                  <BloomIndicator nivel="CRIAR" variant="compact" />
                </div>
              </div>

              {/* Status Pills */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Status</h3>
                <div className="flex flex-wrap gap-2">
                  <StatusPill status="RASCUNHO" />
                  <StatusPill status="EM_REVISAO" />
                  <StatusPill status="APROVADO" />
                  <StatusPill status="PUBLICADO" size="sm" />
                  <StatusPill status="BLOQUEADO" size="sm" />
                </div>
              </div>

              {/* Plano de Aula Cards */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Planos de Aula</h3>
                <div className="space-y-4">
                  <PlanoAulaCard
                    plano={exemploPlanoAula}
                    variant="compact"
                    onView={(id) => console.log('View:', id)}
                  />
                  <PlanoAulaCard
                    plano={exemploPlanoAula}
                    variant="default"
                    onView={(id) => console.log('View:', id)}
                    onEdit={(id) => console.log('Edit:', id)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Componentes de Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="mb-3 text-lg font-semibold">Tabela</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosTabela.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.aluno}</TableCell>
                        <TableCell>{item.nota}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'Aprovado' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Test Page - Layout and Component Integration
 *
 * Temporary page to test ThemeProvider integration and responsive behavior
 * Conforme especificado em Specs.md seção 11
 */

'use client';

import {
  MainLayout,
  EducationalGrid,
  GridWithHeader,
  MasonryGrid,
  StackedGrid,
  GridCard,
} from '@/components/layouts';
import {
  BNCCBadge,
  BloomIndicator,
  StatusPill,
  PlanoAulaCard,
  type BloomLevel,
  type PlanStatus,
} from '@/components/educational';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { useTheme } from '@/providers/theme-provider';

// Mock data for testing
const mockPlanos = [
  {
    id: '1',
    titulo: 'Matemática Básica',
    disciplina: 'Matemática',
    turma: '1º Ano A',
    status: 'RASCUNHO' as PlanStatus,
    competencias: ['EF01MA01'],
    habilidades: ['EF01MA01'],
    niveisBloom: ['lembrar', 'aplicar'] as BloomLevel[],
  },
  {
    id: '2',
    titulo: 'Português Fundamental',
    disciplina: 'Português',
    turma: '2º Ano B',
    status: 'APROVADO' as PlanStatus,
    competencias: ['EF02LP01'],
    habilidades: ['EF02LP01'],
    niveisBloom: ['entender', 'analisar'] as BloomLevel[],
  },
  {
    id: '3',
    titulo: 'Ciências da Natureza',
    disciplina: 'Ciências',
    turma: '3º Ano C',
    status: 'PUBLICADO' as PlanStatus,
    competencias: ['EF03CI01'],
    habilidades: ['EF03CI01'],
    niveisBloom: ['criar', 'avaliar'] as BloomLevel[],
  },
];

export default function TestLayoutPage() {
  const { theme, colorScheme, fontSize } = useTheme();

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header demonstrating theme consumption */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
          }}
        >
          <h1 className="mb-2 text-3xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
            Teste do Design System VirtuQuest
          </h1>
          <p className="text-muted-foreground mb-4">
            Página de teste para verificar integração do ThemeProvider e comportamento responsivo
          </p>

          {/* Theme status */}
          <div className="flex flex-wrap gap-4 text-sm">
            <Badge variant="outline">Tema: {theme}</Badge>
            <Badge variant="outline">Esquema: {colorScheme}</Badge>
            <Badge variant="outline">Fonte: {fontSize}</Badge>
          </div>
        </div>

        {/* Educational Components Showcase */}
        <GridWithHeader
          title="Componentes Educacionais"
          description="Demonstração dos componentes BNCC, Bloom e Status integrados"
          actions={
            <>
              <Button variant="outline">Filtrar</Button>
              <Button>Novo Plano</Button>
            </>
          }
        >
          {mockPlanos.map((plano) => (
            <GridCard
              key={plano.id}
              title={plano.titulo}
              subtitle={`${plano.disciplina} • ${plano.turma}`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BNCCBadge competencia={plano.competencias[0]} />
                  <StatusPill status={plano.status} size="sm" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {plano.niveisBloom.map((nivel) => (
                    <BloomIndicator key={nivel} nivel={nivel} variant="compact" showLabel={false} />
                  ))}
                </div>
              </div>
            </GridCard>
          ))}
        </GridWithHeader>

        {/* Form Components Test */}
        <Card>
          <CardHeader>
            <CardTitle>Componentes de Formulário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Input Básico</label>
                <Input placeholder="Digite algo..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="ciencias">Ciências</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover para Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Componente Tooltip funcionando!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* Different Grid Layouts */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Layouts de Grade Responsivos</h2>

          {/* Standard Educational Grid */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Educational Grid</h3>
            <EducationalGrid>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <Card key={num} className="p-4">
                  <p className="text-center">Item {num}</p>
                </Card>
              ))}
            </EducationalGrid>
          </div>

          {/* Masonry Grid */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Masonry Grid</h3>
            <MasonryGrid>
              {[
                { id: 1, height: 'h-32', content: 'Card Baixo' },
                { id: 2, height: 'h-48', content: 'Card Médio' },
                { id: 3, height: 'h-24', content: 'Card Mínimo' },
                { id: 4, height: 'h-40', content: 'Card Alto' },
                { id: 5, height: 'h-28', content: 'Card Pequeno' },
                { id: 6, height: 'h-52', content: 'Card Grande' },
              ].map((item) => (
                <Card key={item.id} className={`mb-4 break-inside-avoid p-4 ${item.height}`}>
                  <p className="text-center">{item.content}</p>
                </Card>
              ))}
            </MasonryGrid>
          </div>

          {/* Stacked Grid */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Stacked Grid</h3>
            <StackedGrid>
              {mockPlanos.map((plano) => (
                <PlanoAulaCard
                  key={plano.id}
                  plano={plano}
                  variant="default"
                  onEdit={() => console.log('Edit', plano.id)}
                  onView={() => console.log('View', plano.id)}
                />
              ))}
            </StackedGrid>
          </div>
        </div>

        {/* Design Tokens Test */}
        <Card>
          <CardHeader>
            <CardTitle>Verificação de Design Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { name: 'Primary', var: '--primary' },
                { name: 'Secondary', var: '--secondary' },
                { name: 'Success', var: '--success' },
                { name: 'Warning', var: '--warning' },
                { name: 'Destructive', var: '--destructive' },
                { name: 'Muted', var: '--muted' },
                { name: 'Accent', var: '--accent' },
                { name: 'Border', var: '--border' },
              ].map((token) => (
                <div key={token.name} className="space-y-2">
                  <p className="text-sm font-medium">{token.name}</p>
                  <div
                    className="h-12 rounded border"
                    style={{ backgroundColor: `hsl(var(${token.var}))` }}
                  />
                  <code className="text-xs">hsl(var({token.var}))</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

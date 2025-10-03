/**
 * ContentTab - Tab de conteúdo do PlannerEditor
 *
 * Campos básicos e editor rico para informações gerais do plano.
 *
 * @module components/planner/content-tab
 */

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Control } from 'react-hook-form';
import type { PlannerFormData } from '@/types/planner';

interface ContentTabProps {
  control: Control<PlannerFormData>;
  className?: string;
}

/**
 * ContentTab Component
 *
 * Tab para informações básicas, objetivos e metodologia do plano.
 */
export function ContentTab({ control, className }: ContentTabProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Descreva os objetivos de aprendizagem, metodologia e recursos...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // TODO: Atualizar campo do form
      // control.setValue('metadados.descricao', editor.getHTML());
    },
  });

  return (
    <div className={cn('space-y-6', className)}>
      {/* Informações Básicas */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h3 className="text-lg font-semibold">Informações Básicas</h3>

          <FormField
            control={control}
            name="metadados.titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Plano *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Sistema Solar e Movimentos da Terra"
                    maxLength={200}
                  />
                </FormControl>
                <FormDescription>
                  Título descritivo e objetivo (máximo 200 caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={control}
              name="metadados.disciplina"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disciplina *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Língua Portuguesa">Língua Portuguesa</SelectItem>
                      <SelectItem value="Matemática">Matemática</SelectItem>
                      <SelectItem value="Ciências">Ciências</SelectItem>
                      <SelectItem value="História">História</SelectItem>
                      <SelectItem value="Geografia">Geografia</SelectItem>
                      <SelectItem value="Arte">Arte</SelectItem>
                      <SelectItem value="Educação Física">Educação Física</SelectItem>
                      <SelectItem value="Inglês">Inglês</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="metadados.serie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Série/Ano *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(9)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 1}º ano EF`}>
                          {i + 1}º ano EF
                        </SelectItem>
                      ))}
                      {[...Array(3)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 1}ª série EM`}>
                          {i + 1}ª série EM
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={control}
              name="metadados.turma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 6º A" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="metadados.data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Prevista *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split('T')[0]
                          : field.value
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="metadados.duracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração Total (min) *</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        {...field}
                        min={10}
                        max={600}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange((field.value || 0) + 10)}
                      >
                        +10
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Objetivos de Aprendizagem */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Objetivos de Aprendizagem</h3>
            <div className="text-xs text-muted-foreground">
              Use verbos de ação alinhados com Bloom
            </div>
          </div>

          {/* Editor Rico */}
          <div className="space-y-2">
            {/* Toolbar */}
            {editor && (
              <div className="flex gap-1 rounded-md border bg-muted/50 p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={cn('h-8 w-8', editor.isActive('bold') && 'bg-primary/10')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={cn('h-8 w-8', editor.isActive('italic') && 'bg-primary/10')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={cn(
                    'h-8 w-8',
                    editor.isActive('heading', { level: 2 }) && 'bg-primary/10'
                  )}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={cn('h-8 w-8', editor.isActive('bulletList') && 'bg-primary/10')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={cn('h-8 w-8', editor.isActive('orderedList') && 'bg-primary/10')}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Editor */}
            <div className="min-h-[200px] rounded-md border p-4">
              <EditorContent editor={editor} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metodologia */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h3 className="text-lg font-semibold">Metodologia</h3>
          <FormField
            control={control}
            name="metadados.descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição da Abordagem Pedagógica *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descreva como os 4 momentos de Perrenoud serão trabalhados..."
                    rows={6}
                  />
                </FormControl>
                <FormDescription>
                  Explique a estratégia pedagógica e como os conteúdos serão desenvolvidos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h3 className="text-lg font-semibold">Observações Gerais</h3>
          <Textarea placeholder="Notas adicionais do professor..." rows={4} />
        </CardContent>
      </Card>
    </div>
  );
}

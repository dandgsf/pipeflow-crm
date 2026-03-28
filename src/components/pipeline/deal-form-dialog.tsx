'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PIPELINE_STAGES, type Deal, type PipelineStage, type WorkspaceMember } from '@/types'

// Tipo mínimo de lead necessário para o select
export interface DealLeadOption {
  id: string
  name: string
  company?: string
}

// ── Schema ────────────────────────────────────────────────────────────────────

const dealSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  lead_id: z.string().min(1, 'Selecione um lead vinculado'),
  stage: z.enum([
    'novo_lead',
    'contato_realizado',
    'proposta_enviada',
    'negociacao',
    'fechado_ganho',
    'fechado_perdido',
  ]),
  estimated_value: z.string().optional(),
  owner_id: z.string().min(1, 'Selecione um responsável'),
  due_date: z.string().optional(),
  notes: z.string().optional(),
})

type DealFormValues = z.infer<typeof dealSchema>

// ── Tipos exportados ──────────────────────────────────────────────────────────

export interface DealSavePayload {
  title: string
  lead_id: string
  stage: PipelineStage
  estimated_value?: number
  owner_id: string
  due_date?: string
  notes?: string
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface DealFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal?: Deal | null
  defaultStage?: PipelineStage
  onSave: (payload: DealSavePayload, deal?: Deal | null) => void
  onDelete?: (deal: Deal) => void
  leads?: DealLeadOption[]
  members?: WorkspaceMember[]
  currentUserId?: string
}

// ── Componente ────────────────────────────────────────────────────────────────

export function DealFormDialog({
  open,
  onOpenChange,
  deal,
  defaultStage = 'novo_lead',
  onSave,
  onDelete,
  leads = [],
  members = [],
  currentUserId = '',
}: DealFormDialogProps) {
  const isEditing = !!deal

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      lead_id: '',
      stage: defaultStage,
      estimated_value: '',
      owner_id: currentUserId,
      due_date: '',
      notes: '',
    },
  })

  // Reset do formulário ao abrir/fechar ou trocar o deal
  useEffect(() => {
    if (open) {
      if (deal) {
        // Modo edição — preencher com dados do deal
        form.reset({
          title: deal.title,
          lead_id: deal.lead_id,
          stage: deal.stage,
          estimated_value: deal.estimated_value?.toString() ?? '',
          owner_id: deal.owner_id ?? currentUserId,
          due_date: deal.due_date
            ? deal.due_date.split('T')[0] // 'YYYY-MM-DD' para input type="date"
            : '',
          notes: deal.notes ?? '',
        })
      } else {
        // Modo criação — defaults com estágio pré-selecionado
        form.reset({
          title: '',
          lead_id: '',
          stage: defaultStage,
          estimated_value: '',
          owner_id: currentUserId,
          due_date: '',
          notes: '',
        })
      }
    }
  }, [open, deal, defaultStage, form, currentUserId])

  function onSubmit(values: DealFormValues) {
    const payload: DealSavePayload = {
      title: values.title,
      lead_id: values.lead_id,
      stage: values.stage,
      estimated_value: values.estimated_value
        ? parseFloat(values.estimated_value) || undefined
        : undefined,
      owner_id: values.owner_id,
      due_date: values.due_date
        ? new Date(values.due_date + 'T00:00:00').toISOString()
        : undefined,
      notes: values.notes || undefined,
    }
    onSave(payload, deal)
    onOpenChange(false)
  }

  function handleDelete() {
    if (deal && onDelete) {
      onDelete(deal)
      onOpenChange(false)
    }
  }

  const sortedLeads = [...leads].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar negócio' : 'Novo negócio'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Implementação CRM — Empresa XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lead vinculado */}
            <FormField
              control={form.control}
              name="lead_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead vinculado *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um lead" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sortedLeads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name}
                          {lead.company ? ` — ${lead.company}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estágio + Responsável */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estágio *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PIPELINE_STAGES.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map((m) => (
                          <SelectItem key={m.user_id} value={m.user_id}>
                            {m.user?.full_name ?? m.user?.email ?? m.user_id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Valor estimado + Prazo */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="estimated_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor estimado (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="100"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas sobre este negócio..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Footer */}
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              {/* Botão de exclusão — apenas em modo edição */}
              {isEditing && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button type="button" variant="ghost" size="sm" className="mr-auto gap-1.5 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir negócio?</AlertDialogTitle>
                      <AlertDialogDescription>
                        O negócio <strong>&ldquo;{deal?.title}&rdquo;</strong> será removido permanentemente.
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <div className="flex gap-2 sm:ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? 'Salvar alterações' : 'Criar negócio'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

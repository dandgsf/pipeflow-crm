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
import type { Lead, LeadStatus } from '@/types'
import { MOCK_OWNERS } from '@/lib/mock/leads'

// ── Schema de validação ────────────────────────────────────────────────────────

const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(['novo', 'contato', 'proposta', 'negociacao', 'ganho', 'perdido']),
  owner_id: z.string().min(1, 'Selecione um responsável'),
  estimated_value: z.string().optional(),
  notes: z.string().optional(),
})

type LeadFormValues = z.infer<typeof leadSchema>

// Public payload passed to onSave (estimated_value already parsed to number)
export interface LeadSavePayload {
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: LeadStatus
  owner_id: string
  estimated_value?: number
  notes?: string
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface LeadFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
  onSave: (values: LeadSavePayload, lead?: Lead | null) => void
  onDelete?: (lead: Lead) => void
}

// ── Componente ─────────────────────────────────────────────────────────────────

export function LeadFormDialog({
  open,
  onOpenChange,
  lead,
  onSave,
  onDelete,
}: LeadFormDialogProps) {
  const isEditing = Boolean(lead)

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      status: 'novo',
      owner_id: MOCK_OWNERS[0].id,
      estimated_value: '',
      notes: '',
    },
  })

  const isSubmitting = form.formState.isSubmitting

  // Preenche o form ao editar
  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? '',
        company: lead.company ?? '',
        position: lead.position ?? '',
        status: lead.status,
        owner_id: lead.owner_id ?? MOCK_OWNERS[0].id,
        estimated_value: lead.estimated_value != null ? String(lead.estimated_value) : '',
        notes: lead.notes ?? '',
      })
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        status: 'novo',
        owner_id: MOCK_OWNERS[0].id,
        estimated_value: '',
        notes: '',
      })
    }
  }, [lead, form])

  async function onSubmit(values: LeadFormValues) {
    // Simula delay de rede (mock)
    await new Promise((r) => setTimeout(r, 400))
    const parsed = parseFloat(values.estimated_value ?? '')
    const payload: LeadSavePayload = {
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      company: values.company || undefined,
      position: values.position || undefined,
      status: values.status,
      owner_id: values.owner_id,
      estimated_value: isNaN(parsed) ? undefined : parsed,
      notes: values.notes || undefined,
    }
    onSave(payload, lead)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar lead' : 'Novo lead'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome + E-mail */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ana Paula Ferreira" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ana@empresa.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Telefone + Empresa */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Ltda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cargo + Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Diretor Comercial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v as LeadStatus)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="novo">Novo</SelectItem>
                        <SelectItem value="contato">Contato</SelectItem>
                        <SelectItem value="proposta">Proposta</SelectItem>
                        <SelectItem value="negociacao">Negociação</SelectItem>
                        <SelectItem value="ganho">Ganho</SelectItem>
                        <SelectItem value="perdido">Perdido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Responsável + Valor estimado */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="owner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_OWNERS.map((o) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.full_name}
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
                name="estimated_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor estimado (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notas */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre este lead…"
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <DialogFooter className="gap-2 sm:gap-0">
              {/* Excluir — só em modo edição */}
              {isEditing && lead && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mr-auto gap-1.5 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir lead
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O lead{' '}
                        <strong>{lead.name}</strong> e todas as suas atividades
                        serão removidos permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          onDelete(lead)
                          onOpenChange(false)
                        }}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting
                  ? 'Salvando…'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Criar lead'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";

interface NewLeadDialogProps {
  onCreated?: (body: Record<string, string>) => Promise<unknown>;
}

export function NewLeadDialog({ onCreated }: NewLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    fd.forEach((v, k) => { if (v) body[k] = v.toString(); });

    if (onCreated) {
      setLoading(true);
      try {
        await onCreated(body);
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar");
      } finally {
        setLoading(false);
      }
    } else {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-pf-surface border-pf-border">
        <DialogHeader>
          <DialogTitle className="text-pf-text">Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-pf-text-secondary">Nome *</Label>
            <Input id="name" name="name" placeholder="Nome completo" required className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-pf-text-secondary">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="email@exemplo.com" className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-pf-text-secondary">Telefone</Label>
              <Input id="phone" name="phone" placeholder="(00) 00000-0000" className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-pf-text-secondary">Empresa</Label>
              <Input id="company" name="company" placeholder="Nome da empresa" className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-pf-text-secondary">Cargo</Label>
              <Input id="position" name="position" placeholder="Cargo" className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source" className="text-pf-text-secondary">Origem</Label>
            <Input id="source" name="source" placeholder="Ex: Website, LinkedIn, Indicação" className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-pf-text-secondary">Notas</Label>
            <Textarea id="notes" name="notes" placeholder="Observações sobre o lead..." rows={3} className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
          </div>

          {error && (
            <p className="rounded-md bg-pf-negative/10 px-3 py-2 text-sm text-pf-negative">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-pf-border text-pf-text-secondary hover:bg-pf-surface-2">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-pf-accent text-pf-bg hover:bg-pf-accent/90">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

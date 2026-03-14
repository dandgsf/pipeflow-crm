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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEAL_STAGE_LABELS, DEAL_STAGE_ORDER } from "@/types/database";
import { MOCK_LEADS, MOCK_MEMBERS } from "@/lib/mock-data";
import { Plus } from "lucide-react";

interface NewDealDialogProps {
  onCreated: (deal: {
    title: string;
    value: number;
    leadId: string;
    stage: string;
    assignedTo: string;
    closeDate: string;
  }) => void;
}

export function NewDealDialog({ onCreated }: NewDealDialogProps) {
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onCreated({
      title: fd.get("title") as string,
      value: parseFloat((fd.get("value") as string) || "0"),
      leadId: fd.get("lead") as string,
      stage: fd.get("stage") as string,
      assignedTo: fd.get("assigned") as string,
      closeDate: fd.get("closeDate") as string,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Negócio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-pf-surface border-pf-border">
        <DialogHeader>
          <DialogTitle className="text-pf-text">Novo Negócio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-pf-text-secondary">Título *</Label>
            <Input id="title" name="title" placeholder="Nome do negócio" required className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-pf-text-secondary">Valor (R$)</Label>
              <Input id="value" name="value" type="number" min="0" step="0.01" placeholder="0,00" className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeDate" className="text-pf-text-secondary">Prazo</Label>
              <Input id="closeDate" name="closeDate" type="date" className="bg-pf-surface-2 border-pf-border text-pf-text" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-pf-text-secondary">Lead *</Label>
            <Select name="lead" required>
              <SelectTrigger className="bg-pf-surface-2 border-pf-border text-pf-text">
                <SelectValue placeholder="Selecione o lead" />
              </SelectTrigger>
              <SelectContent className="bg-pf-surface border-pf-border">
                {MOCK_LEADS.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name} {l.company ? `(${l.company})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-pf-text-secondary">Etapa</Label>
              <Select name="stage" defaultValue="new_lead">
                <SelectTrigger className="bg-pf-surface-2 border-pf-border text-pf-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-pf-surface border-pf-border">
                  {DEAL_STAGE_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {DEAL_STAGE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-pf-text-secondary">Responsável</Label>
              <Select name="assigned">
                <SelectTrigger className="bg-pf-surface-2 border-pf-border text-pf-text">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-pf-surface border-pf-border">
                  {MOCK_MEMBERS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-pf-border text-pf-text-secondary hover:bg-pf-surface-2">
              Cancelar
            </Button>
            <Button type="submit" className="bg-pf-accent text-pf-bg hover:bg-pf-accent/90">Criar Negócio</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

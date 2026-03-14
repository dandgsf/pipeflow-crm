"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MemberRole } from "@/types/database";

interface InviteMemberDialogProps {
  onInvited: () => void;
}

export function InviteMemberDialog({ onInvited }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/members/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao convidar membro");
      }

      setEmail("");
      setRole("member");
      setOpen(false);
      onInvited();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-pf-accent text-pf-bg hover:bg-pf-accent/90 font-semibold">
          <UserPlus className="h-4 w-4" />
          Convidar
        </Button>
      </DialogTrigger>
      <DialogContent className="border-pf-border bg-pf-surface text-pf-text sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-pf-text">
            Convidar membro
          </DialogTitle>
          <DialogDescription className="text-pf-text-secondary">
            Envie um convite por e-mail para adicionar um novo membro ao
            workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email" className="text-pf-text-secondary">
              E-mail
            </Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="nome@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-pf-border bg-pf-surface-2 text-pf-text placeholder:text-pf-text-muted focus-visible:ring-pf-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role" className="text-pf-text-secondary">
              Papel
            </Label>
            <Select value={role} onValueChange={(v) => setRole(v as MemberRole)}>
              <SelectTrigger className="border-pf-border bg-pf-surface-2 text-pf-text focus:ring-pf-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-pf-border bg-pf-surface text-pf-text">
                <SelectItem value="member" className="focus:bg-pf-surface-2 focus:text-pf-text">
                  Membro
                </SelectItem>
                <SelectItem value="admin" className="focus:bg-pf-surface-2 focus:text-pf-text">
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-pf-text-secondary hover:text-pf-text hover:bg-pf-surface-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="gap-2 bg-pf-accent text-pf-bg hover:bg-pf-accent/90 font-semibold"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Enviar convite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

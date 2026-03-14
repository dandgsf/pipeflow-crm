"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Zap } from "lucide-react";

type LimitType = "leads" | "members";

const LIMIT_MESSAGES: Record<LimitType, string> = {
  leads:
    "Você atingiu o limite de 50 leads do plano Free. Faça upgrade para o plano Pro e tenha leads ilimitados.",
  members:
    "Você atingiu o limite de 2 membros do plano Free. Faça upgrade para o plano Pro e adicione membros ilimitados.",
};

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  limitType: LimitType;
}

export function UpgradeModal({ open, onClose, limitType }: UpgradeModalProps) {
  const router = useRouter();

  function handleUpgrade() {
    onClose();
    router.push("/plans");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-pf-border bg-pf-surface sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-pf-text">
            Limite do plano Free atingido
          </DialogTitle>
          <DialogDescription className="text-sm text-pf-text-secondary">
            {LIMIT_MESSAGES[limitType]}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-pf-accent/20 bg-pf-accent/[0.05] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-pf-accent" />
            <span className="text-sm font-semibold text-pf-accent">
              Plano Pro — R$49/mês
            </span>
          </div>
          <ul className="space-y-1.5 text-sm text-pf-text-secondary">
            <li>Leads ilimitados</li>
            <li>Membros ilimitados</li>
            <li>Relatórios avançados</li>
            <li>Suporte prioritário</li>
          </ul>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <button
            onClick={onClose}
            className="rounded-lg border border-pf-border bg-pf-surface-2 px-4 py-2 text-sm font-medium text-pf-text-secondary transition-colors hover:bg-pf-surface hover:text-pf-text"
          >
            Fechar
          </button>
          <button
            onClick={handleUpgrade}
            className="flex items-center justify-center gap-2 rounded-lg bg-pf-accent px-4 py-2 text-sm font-semibold text-pf-bg transition-colors hover:bg-pf-accent/90"
          >
            <Zap className="h-4 w-4" />
            Fazer upgrade
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

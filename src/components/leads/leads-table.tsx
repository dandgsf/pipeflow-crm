"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadWithCounts } from "@/types/database";
import { formatDate } from "@/lib/utils";

interface LeadsTableProps {
  leads: LeadWithCounts[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border border-pf-border bg-pf-surface overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-pf-border hover:bg-pf-surface-2">
            <TableHead className="font-mono uppercase text-xs text-pf-text-muted tracking-wider">Nome</TableHead>
            <TableHead className="font-mono uppercase text-xs text-pf-text-muted tracking-wider">E-mail</TableHead>
            <TableHead className="font-mono uppercase text-xs text-pf-text-muted tracking-wider">Telefone</TableHead>
            <TableHead className="font-mono uppercase text-xs text-pf-text-muted tracking-wider">Empresa</TableHead>
            <TableHead className="font-mono uppercase text-xs text-pf-text-muted tracking-wider">Status</TableHead>
            <TableHead className="font-mono uppercase text-xs text-pf-text-muted tracking-wider">Responsável</TableHead>
            <TableHead className="font-mono uppercase text-xs text-pf-text-muted tracking-wider">Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow className="border-pf-border">
              <TableCell colSpan={7} className="h-24 text-center text-pf-text-muted">
                Nenhum lead encontrado.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer border-pf-border hover:bg-pf-surface-2 transition-colors"
                onClick={() => router.push(`/leads/${lead.id}`)}
              >
                <TableCell className="font-medium text-pf-text">{lead.name}</TableCell>
                <TableCell className="text-pf-text-secondary">{lead.email ?? "—"}</TableCell>
                <TableCell className="text-pf-text-secondary">{lead.phone ?? "—"}</TableCell>
                <TableCell className="text-pf-text-secondary">{lead.company ?? "—"}</TableCell>
                <TableCell>
                  <LeadStatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="text-pf-text-secondary">{lead.assigned_to ? "Responsável" : "—"}</TableCell>
                <TableCell className="text-pf-text-secondary">{formatDate(lead.created_at)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

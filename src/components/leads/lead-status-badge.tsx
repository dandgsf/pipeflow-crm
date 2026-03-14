"use client";

import { Badge } from "@/components/ui/badge";
import { LeadStatus, LEAD_STATUS_LABELS } from "@/types/database";

const statusVariants: Record<LeadStatus, string> = {
  new: "bg-pf-cool/20 text-pf-cool hover:bg-pf-cool/20",
  qualified: "bg-pf-positive/20 text-pf-positive hover:bg-pf-positive/20",
  disqualified: "bg-pf-text-muted/20 text-pf-text-muted hover:bg-pf-text-muted/20",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="secondary" className={statusVariants[status]}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}

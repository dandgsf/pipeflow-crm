"use client";

import { Badge } from "@/components/ui/badge";
import { LeadStatus, LEAD_STATUS_LABELS } from "@/types/database";

const statusVariants: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  qualified: "bg-green-100 text-green-800 hover:bg-green-100",
  disqualified: "bg-gray-100 text-gray-600 hover:bg-gray-100",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="secondary" className={statusVariants[status]}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}

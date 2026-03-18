"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DealWithLead } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getMemberName } from "@/lib/mock-data";
import { Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealCardProps {
  deal: DealWithLead;
}

export function DealCard({ deal }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue =
    deal.expected_close_date &&
    new Date(deal.expected_close_date) < new Date() &&
    deal.stage !== "closed_won" &&
    deal.stage !== "closed_lost";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab rounded-lg border border-pf-border-subtle bg-pf-surface p-3 shadow-sm active:cursor-grabbing hover:border-pf-accent/20 hover:-translate-y-0.5 hover:shadow-md transition-all",
        isDragging && "opacity-40 shadow-lg"
      )}
    >
      <p className="font-medium text-sm leading-snug text-pf-text">{deal.title}</p>
      <p className="mt-1 text-base font-semibold text-pf-positive">
        {formatCurrency(deal.value)}
      </p>
      <p className="mt-1 text-xs text-pf-text-muted">{deal.lead.name}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-pf-text-muted">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {getMemberName(deal.assigned_to)}
        </span>
        {deal.expected_close_date && (
          <span className={cn("flex items-center gap-1", isOverdue && "text-pf-negative")}>
            <Calendar className="h-3 w-3" />
            {formatDate(deal.expected_close_date)}
          </span>
        )}
      </div>
    </div>
  );
}

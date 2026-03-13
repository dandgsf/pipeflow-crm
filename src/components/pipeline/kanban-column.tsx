"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DealWithLead, DealStage, DEAL_STAGE_LABELS, DEAL_STAGE_COLORS } from "@/types/database";
import { DealCard } from "./deal-card";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  stage: DealStage;
  deals: DealWithLead[];
  isOver: boolean;
}

export function KanbanColumn({ stage, deals, isOver }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: stage });

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const color = DEAL_STAGE_COLORS[stage];

  return (
    <div className="flex w-72 shrink-0 flex-col">
      {/* Column header */}
      <div
        className={cn(
          "mb-2 rounded-lg px-3 py-2 transition-colors",
          isOver ? "ring-2 ring-inset ring-blue-400" : ""
        )}
        style={{ backgroundColor: `${color}20`, borderLeft: `3px solid ${color}` }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color }}>
            {DEAL_STAGE_LABELS[stage]}
          </span>
          <Badge variant="secondary" className="text-xs">
            {deals.length}
          </Badge>
        </div>
        {totalValue > 0 && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatCurrency(totalValue)}
          </p>
        )}
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 rounded-lg p-1 min-h-[120px] transition-colors",
          isOver && "bg-blue-50"
        )}
      >
        <SortableContext
          items={deals.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

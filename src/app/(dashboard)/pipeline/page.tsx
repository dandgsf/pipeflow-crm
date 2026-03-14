"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "@/components/pipeline/kanban-column";
import { DealCard } from "@/components/pipeline/deal-card";
import { NewDealDialog } from "@/components/pipeline/new-deal-dialog";
import { useDeals } from "@/hooks/use-deals";
import { DealStage, DEAL_STAGE_ORDER, DealWithLead } from "@/types/database";
import { Loader2 } from "lucide-react";

export default function PipelinePage() {
  const { deals, setDeals, loading, moveStage, createDeal } = useDeals();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeDeal = deals.find((d) => d.id === activeId) ?? null;

  function getDealsByStage(stage: DealStage) {
    return deals.filter((d) => d.stage === stage);
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id as string ?? null);
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeDeal = deals.find((d) => d.id === activeId);
    if (!activeDeal) return;

    // Dropped on a column (stage)
    if (DEAL_STAGE_ORDER.includes(overId as DealStage)) {
      const newStage = overId as DealStage;
      if (activeDeal.stage !== newStage) {
        await moveStage(activeId, newStage);
      }
      return;
    }

    // Dropped on another card
    const overDeal = deals.find((d) => d.id === overId);
    if (!overDeal) return;

    if (activeDeal.stage !== overDeal.stage) {
      await moveStage(activeId, overDeal.stage);
    } else {
      const stageDeals = deals.filter((d) => d.stage === activeDeal.stage);
      const activeIdx = stageDeals.findIndex((d) => d.id === activeId);
      const overIdx = stageDeals.findIndex((d) => d.id === overId);
      const reordered = arrayMove(stageDeals, activeIdx, overIdx);
      setDeals((prev) => [
        ...prev.filter((d) => d.stage !== activeDeal.stage),
        ...reordered,
      ]);
    }
  }

  async function handleNewDeal(data: {
    title: string;
    value: number;
    leadId: string;
    stage: string;
    assignedTo: string;
    closeDate: string;
  }) {
    await createDeal({
      title: data.title,
      value: data.value,
      lead_id: data.leadId,
      stage: data.stage || "new_lead",
      assigned_to: data.assignedTo || undefined,
      expected_close_date: data.closeDate || undefined,
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-pf-border-subtle bg-pf-surface px-6 py-4">
        <h2 className="font-display font-semibold text-pf-text">Pipeline de Vendas</h2>
        <NewDealDialog onCreated={handleNewDeal} />
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto p-6">
            {DEAL_STAGE_ORDER.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                deals={getDealsByStage(stage)}
                isOver={overId === stage}
              />
            ))}
          </div>

          <DragOverlay>
            {activeDeal ? <DealCard deal={activeDeal} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

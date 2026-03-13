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
import { MOCK_DEALS, MOCK_LEADS } from "@/lib/mock-data";
import { DealStage, DEAL_STAGE_ORDER, DealWithLead } from "@/types/database";

export default function PipelinePage() {
  const [deals, setDeals] = useState<DealWithLead[]>(MOCK_DEALS);
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

  function handleDragEnd({ active, over }: DragEndEvent) {
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
        setDeals((prev) =>
          prev.map((d) => (d.id === activeId ? { ...d, stage: newStage } : d))
        );
      }
      return;
    }

    // Dropped on another card
    const overDeal = deals.find((d) => d.id === overId);
    if (!overDeal) return;

    if (activeDeal.stage !== overDeal.stage) {
      // Move to different stage
      setDeals((prev) =>
        prev.map((d) =>
          d.id === activeId ? { ...d, stage: overDeal.stage } : d
        )
      );
    } else {
      // Reorder within same stage
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

  function handleNewDeal(data: {
    title: string;
    value: number;
    leadId: string;
    stage: string;
    assignedTo: string;
    closeDate: string;
  }) {
    const lead = MOCK_LEADS.find((l) => l.id === data.leadId);
    if (!lead) return;

    const newDeal: DealWithLead = {
      id: `deal-${Date.now()}`,
      workspace_id: "ws-1",
      lead_id: data.leadId,
      title: data.title,
      value: data.value,
      stage: (data.stage || "new_lead") as DealStage,
      assigned_to: data.assignedTo || null,
      expected_close_date: data.closeDate ? `${data.closeDate}T00:00:00Z` : null,
      closed_at: null,
      position: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lead: { id: lead.id, name: lead.name, company: lead.company },
    };

    setDeals((prev) => [newDeal, ...prev]);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h2 className="font-semibold text-gray-700">Pipeline de Vendas</h2>
        <NewDealDialog onCreated={handleNewDeal} />
      </div>

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
    </div>
  );
}

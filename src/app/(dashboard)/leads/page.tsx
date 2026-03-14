"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadsFilters } from "@/components/leads/leads-filters";
import { NewLeadDialog } from "@/components/leads/new-lead-dialog";
import { useLeads } from "@/hooks/use-leads";
import { Loader2 } from "lucide-react";

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  const { leads, loading, error, createLead } = useLeads({
    search,
    status: statusFilter,
    assigned_to: assignedFilter,
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          {!loading && <Badge variant="secondary">{leads.length}</Badge>}
        </div>
        <NewLeadDialog onCreated={createLead} />
      </div>

      <LeadsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        assignedFilter={assignedFilter}
        onAssignedFilterChange={setAssignedFilter}
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</p>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}

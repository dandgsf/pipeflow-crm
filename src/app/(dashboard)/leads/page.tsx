"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadsFilters } from "@/components/leads/leads-filters";
import { NewLeadDialog } from "@/components/leads/new-lead-dialog";
import { MOCK_LEADS } from "@/lib/mock-data";

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  const filteredLeads = useMemo(() => {
    return MOCK_LEADS.filter((lead) => {
      const matchesSearch =
        search === "" ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        (lead.company?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      const matchesAssigned =
        assignedFilter === "all" || lead.assigned_to === assignedFilter;

      return matchesSearch && matchesStatus && matchesAssigned;
    });
  }, [search, statusFilter, assignedFilter]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <Badge variant="secondary">{filteredLeads.length}</Badge>
        </div>
        <NewLeadDialog />
      </div>

      <LeadsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        assignedFilter={assignedFilter}
        onAssignedFilterChange={setAssignedFilter}
      />

      <LeadsTable leads={filteredLeads} />
    </div>
  );
}

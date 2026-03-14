"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUS_LABELS, LeadStatus } from "@/types/database";
import { MOCK_MEMBERS } from "@/lib/mock-data";
import { Search } from "lucide-react";

interface LeadsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  assignedFilter: string;
  onAssignedFilterChange: (value: string) => void;
}

export function LeadsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  assignedFilter,
  onAssignedFilterChange,
}: LeadsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pf-text-muted" />
        <Input
          placeholder="Buscar por nome ou empresa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-pf-surface border-pf-border text-pf-text placeholder:text-pf-text-muted focus:border-pf-accent/50 focus:ring-pf-accent/20"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-pf-surface border-pf-border text-pf-text">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-pf-surface border-pf-border">
          <SelectItem value="all">Todos os status</SelectItem>
          {(Object.entries(LEAD_STATUS_LABELS) as [LeadStatus, string][]).map(
            ([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      <Select value={assignedFilter} onValueChange={onAssignedFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-pf-surface border-pf-border text-pf-text">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent className="bg-pf-surface border-pf-border">
          <SelectItem value="all">Todos</SelectItem>
          {MOCK_MEMBERS.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

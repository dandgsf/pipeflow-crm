"use client";

import { useState, useEffect, useCallback } from "react";
import type { Workspace, MemberRole, Member } from "@/types/database";

interface WorkspaceWithRole {
  workspace_id: string;
  role: MemberRole;
  workspaces: Workspace;
}

export function useWorkspace() {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithRole[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(null);
  const [role, setRole] = useState<MemberRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workspaces");
      if (!res.ok) throw new Error("Erro ao carregar workspaces");
      const data: WorkspaceWithRole[] = await res.json();
      setWorkspaces(data);

      // Restore active workspace from localStorage or use first
      const storedId =
        typeof window !== "undefined"
          ? localStorage.getItem("pf_active_workspace")
          : null;

      const match = data.find((w) => w.workspaces.id === storedId);
      const active = match ?? data[0];

      if (active) {
        setActiveWorkspaceState(active.workspaces);
        setRole(active.role);
        if (typeof window !== "undefined") {
          localStorage.setItem("pf_active_workspace", active.workspaces.id);
        }
      }
    } catch {
      // silently fail — user might not be logged in
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  // When active workspace changes, also fetch role from /api/members
  const fetchRole = useCallback(async () => {
    if (!activeWorkspace) return;
    try {
      const res = await fetch("/api/members");
      if (!res.ok) return;
      const members: Member[] = await res.json();
      // Find current user's role by matching workspace member data
      // The API already filters by workspace, so we look for the entry
      // that matches the active workspace's members list
      const match = workspaces.find(
        (w) => w.workspaces.id === activeWorkspace.id
      );
      if (match) {
        setRole(match.role);
      }
    } catch {
      // silent
    }
  }, [activeWorkspace, workspaces]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  function setActiveWorkspace(workspace: Workspace) {
    setActiveWorkspaceState(workspace);
    if (typeof window !== "undefined") {
      localStorage.setItem("pf_active_workspace", workspace.id);
    }
    // Find the role for this workspace
    const match = workspaces.find((w) => w.workspaces.id === workspace.id);
    if (match) {
      setRole(match.role);
    }
  }

  return {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    loading,
    role,
  };
}

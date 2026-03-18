"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  UserCircle,
  CreditCard,
  LogOut,
  X,
  ChevronDown,
  Check,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspace";
import { Logo } from "@/components/shared/logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/members", label: "Membros", icon: UserCircle },
  { href: "/plans", label: "Plano", icon: CreditCard },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { workspaces, activeWorkspace, setActiveWorkspace, loading: wsLoading } = useWorkspace();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function handleSwitchWorkspace(workspace: typeof activeWorkspace) {
    if (!workspace) return;
    setActiveWorkspace(workspace);
    setDropdownOpen(false);
    // Reload the page to refetch data for the new workspace
    window.location.reload();
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-pf-border-subtle bg-pf-surface transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-pf-border-subtle px-4">
          <Logo size="md" />
          <button onClick={onClose} className="lg:hidden text-pf-text-muted hover:text-pf-text transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace Switcher */}
        {!wsLoading && workspaces.length > 0 && (
          <div className="border-b border-pf-border-subtle px-3 py-3" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-pf-border bg-pf-surface-2 px-3 py-2 text-sm text-pf-text transition-colors hover:border-pf-border hover:bg-pf-bg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="h-4 w-4 shrink-0 text-pf-text-muted" />
                <span className="truncate font-medium">
                  {activeWorkspace?.name ?? "Workspace"}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-pf-text-muted transition-transform",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="mt-1 rounded-lg border border-pf-border bg-pf-surface-2 py-1 shadow-lg">
                {workspaces.map((ws) => {
                  const isActive = ws.workspaces.id === activeWorkspace?.id;
                  return (
                    <button
                      key={ws.workspaces.id}
                      onClick={() => handleSwitchWorkspace(ws.workspaces)}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-pf-accent/[0.08] text-pf-accent"
                          : "text-pf-text-secondary hover:bg-pf-bg hover:text-pf-text"
                      )}
                    >
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">{ws.workspaces.name}</span>
                      {isActive && (
                        <Check className="ml-auto h-4 w-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "pf-nav-active text-pf-accent"
                    : "text-pf-text-secondary hover:bg-white/[0.03] hover:text-pf-text"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-pf-border-subtle p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-pf-text-muted hover:text-pf-text hover:bg-white/[0.03]"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}

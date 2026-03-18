"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/pipeline": "Pipeline",
  "/members": "Membros",
  "/plans": "Plano",
};

function getPageTitle(pathname: string): string {
  for (const [prefix, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(prefix)) return title;
  }
  return "PipeFlow CRM";
}

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 items-center border-b border-pf-border-subtle bg-pf-surface px-4 lg:px-6 relative overflow-hidden">
      {/* Subtle accent gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(202,255,51,0.03),transparent_60%)] pointer-events-none" />
      <Button
        variant="ghost"
        size="icon"
        className="mr-3 lg:hidden text-pf-text-muted hover:text-pf-text"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="font-display text-base font-semibold text-pf-text tracking-tight">{title}</h1>
    </header>
  );
}

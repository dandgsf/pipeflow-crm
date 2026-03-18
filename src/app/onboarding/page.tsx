"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function OnboardingPage() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptingInvite, setAcceptingInvite] = useState(true);

  // On mount: try to accept pending invite via email-matching
  useEffect(() => {
    async function checkPendingInvite() {
      try {
        const res = await fetch("/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.id) {
            // Invite accepted — redirect to dashboard
            router.push("/dashboard");
            router.refresh();
            return;
          }
        }
      } catch {
        // No pending invite — show workspace creation form
      }
      setAcceptingInvite(false);
    }
    checkPendingInvite();
  }, [router]);

  function handleNameChange(value: string) {
    setWorkspaceName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function handleSlugChange(value: string) {
    setSlug(slugify(value));
    setSlugEdited(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workspaceName, slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao criar workspace.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  if (acceptingInvite) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pf-bg p-4">
        <div className="flex items-center gap-3 text-pf-text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verificando convites pendentes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pf-bg p-4">
      <Card className="w-full max-w-md shadow-sm bg-pf-surface border-pf-border">
        <CardHeader className="space-y-1 pb-2 text-center">
          <div className="mb-1 font-display text-2xl font-bold tracking-tight text-pf-text">
            Crie seu espaço de trabalho
          </div>
          <p className="text-sm text-pf-text-secondary">
            Cada empresa ou time tem seu próprio workspace isolado
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name" className="text-pf-text-secondary">Nome da empresa</Label>
              <Input
                id="workspace-name"
                placeholder="Ex: Acme Corp"
                value={workspaceName}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-pf-text-secondary">Identificador (slug)</Label>
              <Input
                id="slug"
                placeholder="acme-corp"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                required
                pattern="[a-z0-9-]+"
                className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted"
              />
              <p className="text-xs text-pf-text-muted">
                Apenas letras minúsculas, números e hífens
              </p>
            </div>

            {error && (
              <p className="rounded-md bg-pf-negative/10 px-3 py-2 text-sm text-pf-negative">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full bg-pf-accent text-pf-bg hover:bg-pf-accent/90 font-medium" disabled={loading || !workspaceName || !slug}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar workspace e começar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail ou senha inválidos. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pf-bg p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-pf-accent rounded-lg flex items-center justify-center font-display font-extrabold text-lg text-pf-bg">P</div>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pf-text mb-1">
            PipeFlow CRM
          </h1>
          <p className="text-sm text-pf-text-muted">Entrar na sua conta</p>
        </div>

        <div className="bg-pf-surface border border-pf-border rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-pf-text-secondary">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-pf-bg border-pf-border text-pf-text placeholder:text-pf-text-muted focus:ring-pf-accent focus:border-pf-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-pf-text-secondary">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-pf-bg border-pf-border text-pf-text placeholder:text-pf-text-muted pr-10 focus:ring-pf-accent focus:border-pf-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pf-text-muted hover:text-pf-text transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-pf-negative/10 border border-pf-negative/20 px-3 py-2 text-sm text-pf-negative">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-pf-accent text-pf-bg hover:bg-pf-accent/90 font-semibold"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-pf-text-muted">
          Não tem uma conta?{" "}
          <Link href="/signup" className="font-medium text-pf-accent hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

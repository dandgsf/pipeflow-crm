"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/shared/logo";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("invite");
  const inviteEmail = searchParams.get("email") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(inviteEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  const inputCls = "bg-pf-bg border-pf-border text-pf-text placeholder:text-pf-text-muted focus:ring-pf-accent focus:border-pf-accent";

  return (
    <div className="flex min-h-screen items-center justify-center bg-pf-bg p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6">
            <Logo size="lg" className="justify-center" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pf-text mb-1">
            Criar conta
          </h1>
          <p className="text-sm text-pf-text-muted">
            {inviteId ? "Crie sua conta para aceitar o convite" : "Comece a usar o PipeFlow CRM"}
          </p>
        </div>

        <div className="bg-pf-surface border border-pf-border rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-pf-text-secondary">Nome completo</Label>
              <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className={inputCls} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-pf-text-secondary">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" readOnly={!!inviteEmail} className={`${inputCls} ${inviteEmail ? "opacity-60 cursor-not-allowed" : ""}`} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-pf-text-secondary">Senha</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-pf-text-muted hover:text-pf-text transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm text-pf-text-secondary">Confirmar senha</Label>
              <Input id="confirm" type="password" placeholder="Repita a senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className={inputCls} />
            </div>

            {error && (
              <p className="rounded-lg bg-pf-negative/10 border border-pf-negative/20 px-3 py-2 text-sm text-pf-negative">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full bg-pf-accent text-pf-bg hover:bg-pf-accent/90 font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar conta
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-pf-text-muted">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-pf-accent hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-pf-bg p-4">
        <Loader2 className="h-6 w-6 animate-spin text-pf-text-muted" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}

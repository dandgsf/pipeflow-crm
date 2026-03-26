"use client";

import { useState } from "react";
import Link from "next/link";

export function NavbarMobile() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 text-pf-text-secondary hover:text-pf-text transition-colors"
      >
        <span
          className="block w-5 h-px bg-current transition-all duration-200"
          style={open ? { transform: "translateY(3.5px) rotate(45deg)" } : undefined}
        />
        <span
          className="block w-5 h-px bg-current transition-all duration-200"
          style={open ? { transform: "translateY(-3.5px) rotate(-45deg)" } : undefined}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-pf-bg/95 backdrop-blur-md flex flex-col pt-20 px-6"
          onClick={() => setOpen(false)}
        >
          <nav className="flex flex-col gap-1 mt-4">
            {[
              { href: "#features", label: "Funcionalidades" },
              { href: "#results", label: "Resultados" },
              { href: "#pricing", label: "Planos" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-[22px] font-display font-bold text-pf-text-secondary hover:text-pf-accent transition-colors py-3 border-b border-pf-border-subtle"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 mt-8">
            <Link
              href="/register"
              className="w-full bg-pf-accent text-pf-bg py-4 rounded-lg font-semibold text-base text-center pf-glow-btn"
              onClick={() => setOpen(false)}
            >
              Começar grátis →
            </Link>
            <Link
              href="/login"
              className="w-full border border-pf-border text-pf-text-secondary py-4 rounded-lg font-medium text-base text-center hover:text-pf-text transition-colors"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Link>
          </div>

          <p className="font-mono text-[11px] text-pf-text-muted mt-auto mb-8 text-center">
            PipeFlow CRM © 2026
          </p>
        </div>
      )}
    </>
  );
}

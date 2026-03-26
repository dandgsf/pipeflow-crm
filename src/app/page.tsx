import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { WaveSeparator } from "@/components/shared/wave-separator";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { SuccessCases } from "@/components/landing/success-cases";
import { NavbarMobile } from "@/components/landing/navbar-mobile";

/* ─── Data ────────────────────────────────────────────────────────────────── */

const pipelineData = [
  { stage: "novo", color: "#5B7FFF", width: "75%", value: "R$ 32k", count: 12 },
  { stage: "contato", color: "#00B4D8", width: "55%", value: "R$ 24k", count: 8 },
  { stage: "proposta", color: "#CAFF33", width: "40%", value: "R$ 18k", count: 5 },
  { stage: "negociação", color: "#FF6B35", width: "28%", value: "R$ 12k", count: 3 },
  { stage: "fechado ✓", color: "#2ED573", width: "65%", value: "R$ 45k", count: 9 },
];

const stats = [
  { value: "+47%", label: "taxa de conversão", sub: "em 90 dias de uso" },
  { value: "3.2x", label: "leads qualificados", sub: "priorizados pelo pipeline" },
  { value: "-62%", label: "ciclo de venda", sub: "vs. CRMs anteriores" },
  { value: "1.200+", label: "times ativos", sub: "em 38 países" },
];

const features = [
  {
    idx: "01",
    name: "Pipeline Kanban",
    desc: "Arraste negócios entre etapas. Valor total por coluna atualizado em tempo real. Sem reload, sem espera.",
  },
  {
    idx: "02",
    name: "Multi-Empresa",
    desc: "Cada empresa no seu workspace isolado. Dados separados por design. Troca de contexto com um clique.",
  },
  {
    idx: "03",
    name: "Dashboard de Vendas",
    desc: "Funil, conversão, valor do pipeline, velocidade de fechamento. Métricas que importam, zero ruído.",
  },
  {
    idx: "04",
    name: "Timeline de Atividades",
    desc: "Cada ligação, e-mail, reunião e nota registrada no histórico do lead. Contexto completo, sempre.",
  },
  {
    idx: "05",
    name: "Segurança Nativa",
    desc: "Row Level Security no banco. Cada workspace é uma fortaleza. Criptografia em todas as camadas.",
  },
  {
    idx: "06",
    name: "Monetização Real",
    desc: "Stripe integrado. Planos Free e Pro. Webhook automático para ativação instantânea da assinatura.",
  },
];

const freePlan = [
  "Até 2 colaboradores",
  "Até 50 leads",
  "Pipeline Kanban completo",
  "Dashboard de vendas",
  "Timeline de atividades",
];

const proPlan = [
  "Colaboradores ilimitados",
  "Leads ilimitados",
  "Tudo do plano Free",
  "Workspaces ilimitados",
  "Suporte prioritário",
  "Histórico completo de atividades",
];

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-pf-bg text-pf-text">

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-pf-bg/85 backdrop-blur-md border-b border-pf-border-subtle">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[13px] text-pf-text-secondary hover:text-pf-text transition-colors">
              Funcionalidades
            </a>
            <a href="#results" className="text-[13px] text-pf-text-secondary hover:text-pf-text transition-colors">
              Resultados
            </a>
            <a href="#pricing" className="text-[13px] text-pf-text-secondary hover:text-pf-text transition-colors">
              Planos
            </a>
            <div className="w-px h-4 bg-pf-border" />
            <Link
              href="/login"
              className="text-[13px] text-pf-text-secondary hover:text-pf-text transition-colors font-medium"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-pf-accent text-pf-bg px-5 py-2 rounded-md text-[13px] font-semibold pf-glow-btn"
            >
              Começar grátis
            </Link>
          </div>

          {/* Mobile: hamburguer + CTA */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/register"
              className="bg-pf-accent text-pf-bg px-4 py-2 rounded-md text-[12px] font-semibold"
            >
              Começar grátis
            </Link>
            <NavbarMobile />
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Orbs */}
        <div
          className="pf-orb w-[400px] h-[400px] top-[5%] left-[5%]"
          style={{ background: "radial-gradient(circle, rgba(202,255,51,0.14), transparent 70%)" }}
        />
        <div
          className="pf-orb w-[320px] h-[320px] bottom-[10%] right-[8%]"
          style={{
            background: "radial-gradient(circle, rgba(91,127,255,0.12), transparent 70%)",
            animationDelay: "-4s",
          }}
        />
        <div
          className="pf-orb w-[200px] h-[200px] top-[40%] right-[30%]"
          style={{
            background: "radial-gradient(circle, rgba(0,180,216,0.08), transparent 70%)",
            animationDelay: "-7s",
          }}
        />

        <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div className="pf-page-enter">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-pf-accent tracking-[0.15em] uppercase mb-6 border border-pf-accent/20 bg-pf-accent/5 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-pf-accent animate-pulse" />
                CRM de vendas multi-empresa
              </div>

              <h1 className="font-display text-[clamp(38px,5vw,62px)] font-extrabold leading-[1.04] tracking-[-2.5px] mb-6">
                Vendas em
                <br />
                <span className="text-pf-accent relative inline-block">
                  fluxo contínuo
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-pf-accent/30 rounded-full pf-flow-pulse" />
                </span>
                .
              </h1>

              <p className="text-[17px] leading-[1.75] text-pf-text-secondary max-w-[460px] mb-10">
                Gerencie leads, negócios e equipe num CRM que respeita a velocidade
                do seu time. Pipeline visual. Multi-empresa. Sem fricção.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-pf-accent text-pf-bg px-7 py-3.5 rounded-lg font-semibold text-sm pf-glow-btn"
                >
                  Começar grátis →
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 border border-pf-border text-pf-text-secondary px-7 py-3.5 rounded-lg font-medium text-sm hover:text-pf-text hover:border-pf-text-muted transition-all"
                >
                  Ver funcionalidades
                </a>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-pf-text-muted">
                <span className="w-4 h-px bg-pf-border" />
                Sem cartão de crédito · Plano grátis para sempre
              </div>
            </div>

            {/* Right — terminal pipeline viz */}
            <div
              className="hidden lg:block bg-pf-surface border border-pf-border rounded-xl overflow-hidden pf-page-enter"
              style={{ animationDelay: "150ms" }}
            >
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-pf-border-subtle bg-pf-surface-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-3 font-mono text-[11px] text-pf-text-muted">
                  pipeline — workspace: acme-corp
                </span>
              </div>

              {/* Pipeline rows */}
              <div className="p-5 space-y-1">
                {pipelineData.map((row) => (
                  <div
                    key={row.stage}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-pf-accent/[0.06] transition-colors group"
                  >
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.1em] w-[88px] shrink-0"
                      style={{ color: row.color }}
                    >
                      {row.stage}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-pf-surface-2 rounded-full" />
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ width: row.width, background: row.color, transition: "width 1.6s cubic-bezier(.4,0,.2,1)" }}
                      />
                    </div>
                    <span className="font-mono text-xs font-medium w-[68px] text-right">
                      {row.value}
                    </span>
                    <span className="font-mono text-[11px] text-pf-text-muted w-8 text-right">
                      {row.count}
                    </span>
                  </div>
                ))}

                <div className="border-t border-pf-border-subtle mt-4 pt-3 flex justify-between items-center">
                  <span className="font-mono text-[10px] text-pf-text-muted">total pipeline</span>
                  <span className="font-mono text-xs text-pf-accent font-semibold">R$ 131.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveSeparator />
        </div>
      </section>

      {/* ── Stats / Números de resultado ────────────────────────────────────── */}
      <section id="results" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimateOnScroll>
            <div className="grid grid-cols-2 lg:grid-cols-4 border border-pf-border rounded-xl overflow-hidden">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={[
                    "p-6 md:p-8 hover:bg-pf-surface/50 transition-colors",
                    // right border: all except last in each row
                    // desktop: items 0,1,2 get border-r; item 3 doesn't
                    // mobile (2-col): items 0,2 get border-r; items 1,3 don't
                    i % 2 === 0 ? "border-r border-pf-border-subtle" : "",
                    // bottom border: only top row in mobile (items 0,1)
                    i < 2 ? "border-b lg:border-b-0 border-pf-border-subtle" : "",
                    // desktop: item 3 no right border (last in row)
                    i === 3 ? "lg:border-r-0" : "",
                    // desktop: item 2 keeps right border
                  ].join(" ")}
                >
                  <div className="font-display text-[32px] md:text-[36px] font-extrabold tracking-[-2px] text-pf-accent leading-none mb-2">
                    {s.value}
                  </div>
                  <div className="text-[13px] font-semibold text-pf-text mb-1">{s.label}</div>
                  <div className="font-mono text-[10px] text-pf-text-muted uppercase tracking-[0.1em]">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <WaveSeparator />

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimateOnScroll>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-4">
              Funcionalidades
            </div>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-1.5px] leading-[1.15] mb-12">
              O essencial pra vender mais.<br />Nada que atrapalhe.
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-pf-border rounded-xl overflow-hidden">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-pf-surface p-8 md:p-9 relative group hover:bg-pf-surface-2 transition-all"
              >
                {/* Accent top line on hover */}
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-pf-accent group-hover:w-full transition-all duration-[350ms]" />
                <div className="font-mono text-[10px] text-pf-accent/60 mb-5 tracking-[0.1em]">
                  {f.idx}
                </div>
                <div className="font-display text-[17px] font-semibold mb-3">{f.name}</div>
                <div className="text-[13px] leading-[1.7] text-pf-text-secondary">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveSeparator />

      {/* ── Success Cases com CountUp ────────────────────────────────────────── */}
      <SuccessCases />

      <WaveSeparator />

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimateOnScroll>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-4">
              Planos
            </div>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-1.5px] leading-[1.15] mb-4">
              Comece grátis.<br />Escale quando fizer sentido.
            </h2>
            <p className="text-pf-text-secondary text-[15px] mb-12 max-w-[460px]">
              Sem pegadinhas, sem cobranças escondidas. Faça upgrade apenas quando sua equipe crescer.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-pf-border rounded-xl overflow-hidden">

              {/* Free */}
              <div className="bg-pf-surface p-10 md:p-12">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-pf-text-muted mb-6">
                  Free
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="font-display text-[52px] font-extrabold tracking-[-3px] leading-none">
                    R$ 0
                  </span>
                </div>
                <div className="text-[13px] text-pf-text-muted mb-8">Para sempre</div>

                <ul className="space-y-0 mb-10">
                  {freePlan.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 py-3 border-b border-pf-border-subtle text-[13px] text-pf-text-secondary last:border-b-0"
                    >
                      <span className="font-mono text-[10px] text-pf-text-muted shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                  <li className="flex items-center gap-3 py-3 border-b border-pf-border-subtle text-[13px] text-pf-text-muted last:border-b-0">
                    <span className="font-mono text-[10px] text-pf-border shrink-0">—</span>
                    Suporte prioritário
                  </li>
                </ul>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center w-full py-3 rounded-lg font-semibold text-sm border border-pf-border text-pf-text-secondary hover:text-pf-text hover:border-pf-text-muted transition-all"
                >
                  Começar grátis
                </Link>
              </div>

              {/* Pro */}
              <div className="bg-pf-surface-2 p-10 md:p-12 relative overflow-hidden">
                {/* Subtle accent glow */}
                <div
                  className="absolute top-0 right-0 w-[200px] h-[200px] pointer-events-none"
                  style={{ background: "radial-gradient(circle at top right, rgba(202,255,51,0.06), transparent 70%)" }}
                />

                <div className="flex items-center justify-between mb-6">
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-pf-accent">Pro</div>
                  <span className="font-mono text-[10px] bg-pf-accent/10 text-pf-accent border border-pf-accent/20 px-2.5 py-1 rounded-full tracking-[0.1em] uppercase">
                    recomendado
                  </span>
                </div>

                <div className="flex items-end gap-2 mb-1">
                  <span className="font-display text-[52px] font-extrabold tracking-[-3px] leading-none">
                    R$ 49
                  </span>
                  <span className="text-pf-text-muted text-[14px] mb-3">/mês</span>
                </div>
                <div className="text-[13px] text-pf-text-muted mb-8">por workspace</div>

                <ul className="space-y-0 mb-10">
                  {proPlan.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 py-3 border-b border-pf-border-subtle text-[13px] text-pf-text-secondary last:border-b-0"
                    >
                      <span className="font-mono text-[10px] text-pf-accent shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 w-full bg-pf-accent text-pf-bg py-3 rounded-lg font-semibold text-sm pf-glow-btn"
                >
                  Assinar Pro →
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <WaveSeparator />

      {/* ── CTA Final ───────────────────────────────────────────────────────── */}
      <section className="relative text-center py-20 md:py-28 overflow-hidden">
        <div
          className="pf-orb w-[300px] h-[300px] top-[10%] left-[15%]"
          style={{ background: "radial-gradient(circle, rgba(202,255,51,0.09), transparent 70%)" }}
        />
        <div
          className="pf-orb w-[250px] h-[250px] bottom-[10%] right-[20%]"
          style={{
            background: "radial-gradient(circle, rgba(91,127,255,0.07), transparent 70%)",
            animationDelay: "-5s",
          }}
        />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <AnimateOnScroll>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-6">
              Pronto pra começar?
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,56px)] font-extrabold tracking-[-2.5px] leading-[1.05] mb-6">
              Coloque suas vendas<br />em <span className="text-pf-accent">fluxo</span> hoje.
            </h2>
            <p className="text-[16px] text-pf-text-secondary mb-10 max-w-[440px] mx-auto leading-[1.7]">
              Crie sua conta, configure seu workspace e comece a gerenciar leads
              em menos de 2 minutos. Sem cartão de crédito.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-pf-accent text-pf-bg px-9 py-4 rounded-lg font-semibold text-base pf-glow-btn"
              >
                Começar agora — é grátis →
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-pf-border text-pf-text-secondary px-7 py-4 rounded-lg font-medium text-sm hover:text-pf-text hover:border-pf-text-muted transition-all"
              >
                Já tenho conta
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-pf-border-subtle py-8 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs text-pf-text-muted hover:text-pf-text-secondary transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="text-xs text-pf-text-muted hover:text-pf-text-secondary transition-colors">
              Cadastro
            </Link>
            <a href="#pricing" className="text-xs text-pf-text-muted hover:text-pf-text-secondary transition-colors">
              Planos
            </a>
          </div>
          <p className="text-[11px] text-pf-text-muted font-mono">
            Construído com Claude Code — No Code Start Up © 2026
          </p>
        </div>
      </footer>

    </div>
  );
}

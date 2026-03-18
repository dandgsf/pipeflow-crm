import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { WaveSeparator } from "@/components/shared/wave-separator";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { SuccessCases } from "@/components/landing/success-cases";

const pipelineData = [
  { stage: "novo", color: "#5B7FFF", width: "75%", value: "R$ 32k", count: 12 },
  { stage: "contato", color: "#00B4D8", width: "55%", value: "R$ 24k", count: 8 },
  { stage: "proposta", color: "#CAFF33", width: "40%", value: "R$ 18k", count: 5 },
  { stage: "negociação", color: "#FF6B35", width: "28%", value: "R$ 12k", count: 3 },
  { stage: "fechado ✓", color: "#2ED573", width: "65%", value: "R$ 45k", count: 9 },
];

const features = [
  { idx: "01", name: "Pipeline Kanban", desc: "Arraste negócios entre etapas. Valor total por coluna atualizado em tempo real. Sem reload, sem espera." },
  { idx: "02", name: "Multi-Empresa", desc: "Cada empresa no seu workspace isolado. Dados separados por design. Troca de contexto com um clique." },
  { idx: "03", name: "Dashboard de Vendas", desc: "Funil, conversão, valor do pipeline, velocidade de fechamento. Métricas que importam, zero ruído." },
  { idx: "04", name: "Timeline de Atividades", desc: "Cada ligação, e-mail, reunião e nota. Registrado no histórico do lead com contexto completo." },
  { idx: "05", name: "Segurança Nativa", desc: "Row Level Security no banco. Cada workspace é uma fortaleza. Criptografia em todas as camadas." },
  { idx: "06", name: "Monetização Real", desc: "Stripe integrado. Planos Free e Pro. Webhook automático pra ativação instantânea." },
];

const stages = [
  { name: "Novo Lead", sub: "entrada", color: "#5B7FFF" },
  { name: "Contato", sub: "qualificação", color: "#00B4D8" },
  { name: "Proposta", sub: "apresentação", color: "#CAFF33" },
  { name: "Negociação", sub: "decisão", color: "#FF6B35" },
  { name: "Fechado ✓", sub: "conversão", color: "#2ED573" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-pf-bg text-pf-text">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-5 bg-pf-bg/90 backdrop-blur-sm border-b border-pf-border-subtle">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Logo size="md" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-pf-text-secondary hover:text-pf-text transition-colors">Features</a>
            <a href="#cases" className="text-sm text-pf-text-secondary hover:text-pf-text transition-colors">Resultados</a>
            <a href="#pipeline" className="text-sm text-pf-text-secondary hover:text-pf-text transition-colors">Pipeline</a>
            <a href="#pricing" className="text-sm text-pf-text-secondary hover:text-pf-text transition-colors">Planos</a>
            <Link href="/login" className="text-sm text-pf-text-secondary hover:text-pf-text transition-colors font-medium">
              Entrar
            </Link>
            <Link href="/signup" className="bg-pf-accent text-pf-bg px-5 py-2 rounded-md text-[13px] font-semibold pf-glow-btn">
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated orbs */}
        <div className="pf-orb w-[350px] h-[350px] top-[10%] left-[10%]" style={{ background: "radial-gradient(circle, rgba(202,255,51,0.18), transparent 70%)" }} />
        <div className="pf-orb w-[300px] h-[300px] bottom-[10%] right-[10%]" style={{ background: "radial-gradient(circle, rgba(91,127,255,0.14), transparent 70%)", animationDelay: "-4s" }} />

        <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="font-mono text-xs text-pf-accent tracking-[0.15em] uppercase mb-5">
                CRM de vendas multi-empresa
              </div>
              <h1 className="font-display text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-2px] mb-6">
                Vendas em<br />
                <span className="text-pf-accent relative">
                  fluxo contínuo
                  <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-pf-accent/30 pf-flow-pulse" />
                </span>.
              </h1>
              <p className="text-[17px] leading-[1.7] text-pf-text-secondary max-w-[460px] mb-10">
                Gerencie leads, negócios e equipe num CRM que respeita a velocidade
                do seu time. Multi-empresa. Pipeline visual. Sem fricção.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-pf-accent text-pf-bg px-7 py-3.5 rounded-lg font-semibold text-sm pf-glow-btn"
                >
                  Começar grátis →
                </Link>
                <a
                  href="#pipeline"
                  className="inline-flex items-center gap-2 border border-pf-border text-pf-text-secondary px-7 py-3.5 rounded-lg font-medium text-sm hover:text-pf-text hover:border-pf-text-muted transition-all"
                >
                  Ver pipeline
                </a>
              </div>
            </div>

            {/* Terminal-style pipeline viz */}
            <div className="hidden lg:block bg-pf-surface border border-pf-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-pf-border-subtle">
                <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                <span className="ml-3 font-mono text-[11px] text-pf-text-muted">pipeline — workspace: acme-corp</span>
              </div>
              <div className="p-5 space-y-1">
                {pipelineData.map((row) => (
                  <div key={row.stage} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-pf-accent/[0.08] transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] w-[90px] shrink-0" style={{ color: row.color }}>
                      {row.stage}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-pf-surface-2 rounded-full" />
                      <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-[1.5s]" style={{ width: row.width, background: row.color }} />
                    </div>
                    <span className="font-mono text-xs font-medium w-[70px] text-right">{row.value}</span>
                    <span className="font-mono text-[11px] text-pf-text-muted w-[30px] text-right">{row.count}</span>
                  </div>
                ))}
                <div className="border-t border-pf-border-subtle mt-4 pt-3 flex justify-between">
                  <span className="font-mono text-[10px] text-pf-text-muted">total pipeline</span>
                  <span className="font-mono text-xs text-pf-accent font-semibold">R$ 131.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave at bottom of hero */}
        <div className="absolute bottom-0 left-0 w-full">
          <WaveSeparator />
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimateOnScroll>
            <div className="grid grid-cols-2 lg:grid-cols-4 border border-pf-border rounded-xl overflow-hidden">
              {[
                { label: "Leads ativos", value: "47", delta: "↑ 12% vs semana anterior", up: true },
                { label: "Pipeline total", value: "R$ 131k", delta: "↑ 8% vs mês anterior", up: true },
                { label: "Taxa de conversão", value: "68%", delta: "↑ 3pp vs trimestre", up: true },
                { label: "Tempo médio ciclo", value: "14d", delta: "↓ 2 dias vs média", up: false },
              ].map((m, i) => (
                <div key={i} className="p-8 border-r border-b lg:border-b-0 border-pf-border-subtle last:border-r-0 [&:nth-child(2)]:max-lg:border-r-0 hover:bg-pf-surface/50 transition-colors">
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-pf-text-muted mb-2">{m.label}</div>
                  <div className="font-display text-[32px] font-bold tracking-tight">{m.value}</div>
                  <div className={`font-mono text-[11px] mt-1.5 ${m.up ? "text-pf-positive" : "text-pf-negative"}`}>{m.delta}</div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Wave separator */}
      <WaveSeparator />

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimateOnScroll>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-4">Funcionalidades</div>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-1.5px] leading-[1.15] mb-12">
              O essencial pra vender mais.<br />Nada que atrapalhe.
            </h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {features.map((f, i) => (
              <AnimateOnScroll key={i} delay={i * 100}>
                <div
                  className={`bg-pf-surface p-9 relative group hover:bg-pf-surface-2 transition-all hover:-translate-y-1 ${
                    i === 0 ? "md:rounded-tl-xl" : ""
                  } ${i === 2 ? "md:rounded-tr-xl" : ""} ${
                    i === 3 ? "md:rounded-bl-xl" : ""
                  } ${i === 5 ? "md:rounded-br-xl" : ""}`}
                >
                  <div className="absolute top-0 left-0 w-0 h-0.5 bg-pf-accent group-hover:w-full transition-all duration-[400ms]" />
                  <div className="font-mono text-[11px] text-pf-text-muted mb-5">{f.idx}</div>
                  <div className="font-display text-lg font-semibold mb-2.5">{f.name}</div>
                  <div className="text-sm leading-[1.65] text-pf-text-secondary">{f.desc}</div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Wave separator */}
      <WaveSeparator />

      {/* Cases de Sucesso */}
      <div id="cases">
        <SuccessCases />
      </div>

      {/* Wave separator */}
      <WaveSeparator />

      {/* Pipeline */}
      <section id="pipeline" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimateOnScroll>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-4">Pipeline visual</div>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-1.5px] mb-12">Do lead ao fechamento.</h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="flex overflow-x-auto pb-2">
              {stages.map((s, i) => (
                <div key={i} className="flex-1 min-w-[160px] p-7 bg-pf-surface border-r border-pf-border-subtle last:border-r-0 first:rounded-l-xl last:rounded-r-xl hover:bg-pf-surface-2 hover:-translate-y-1 transition-all relative">
                  <div className="w-2 h-2 rounded-full mb-4" style={{ background: s.color }} />
                  <div className="text-[13px] font-semibold mb-1">{s.name}</div>
                  <div className="font-mono text-[10px] text-pf-text-muted uppercase tracking-[0.1em]">{s.sub}</div>
                  {i < stages.length - 1 && (
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 text-[10px] text-pf-text-muted">→</div>
                  )}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Wave separator */}
      <WaveSeparator />

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimateOnScroll>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-4">Planos</div>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-1.5px] mb-12">
              Comece grátis. Escale quando fizer sentido.
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-xl overflow-hidden">
              {/* Free */}
              <div className="bg-pf-surface p-12">
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-pf-text-muted mb-5">Free</div>
                <div className="font-display text-5xl font-extrabold tracking-[-2px] mb-1">R$ 0</div>
                <div className="text-sm text-pf-text-muted mb-8">Para sempre</div>
                <ul className="space-y-0 mb-10">
                  {["Até 2 colaboradores", "Até 50 leads", "Pipeline completo", "Dashboard de vendas"].map((item) => (
                    <li key={item} className="text-sm text-pf-text-secondary py-2 border-b border-pf-border-subtle flex items-center gap-2.5">
                      <span className="font-mono text-xs text-pf-text-muted">→</span> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="inline-block px-7 py-3 rounded-lg font-semibold text-sm border border-pf-border text-pf-text-secondary hover:text-pf-text hover:border-pf-text-muted transition-all">
                  Começar grátis
                </Link>
              </div>
              {/* Pro */}
              <div className="bg-pf-surface-2 p-12">
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-pf-accent mb-5">Pro — recomendado</div>
                <div className="font-display text-5xl font-extrabold tracking-[-2px] mb-1">R$ 49</div>
                <div className="text-sm text-pf-text-muted mb-8">por mês, por workspace</div>
                <ul className="space-y-0 mb-10">
                  {["Colaboradores ilimitados", "Leads ilimitados", "Tudo do Free", "Suporte prioritário"].map((item) => (
                    <li key={item} className="text-sm text-pf-text-secondary py-2 border-b border-pf-border-subtle flex items-center gap-2.5">
                      <span className="font-mono text-xs text-pf-text-muted">→</span> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="inline-flex items-center gap-2 bg-pf-accent text-pf-bg px-7 py-3 rounded-lg font-semibold text-sm pf-glow-btn">
                  Fazer upgrade →
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="relative text-center py-28 overflow-hidden">
        {/* Background orbs */}
        <div className="pf-orb w-[250px] h-[250px] top-[20%] left-[20%]" style={{ background: "radial-gradient(circle, rgba(202,255,51,0.1), transparent 70%)" }} />
        <div className="pf-orb w-[200px] h-[200px] bottom-[20%] right-[25%]" style={{ background: "radial-gradient(circle, rgba(91,127,255,0.08), transparent 70%)", animationDelay: "-5s" }} />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <AnimateOnScroll>
            <h2 className="font-display text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-2px] mb-5">
              Pronto pra colocar suas<br />vendas em <span className="text-pf-accent">fluxo</span>?
            </h2>
            <p className="text-base text-pf-text-secondary mb-10 max-w-[480px] mx-auto">
              Crie sua conta, configure seu workspace e comece a gerenciar leads em menos de 2 minutos.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-pf-accent text-pf-bg px-9 py-4 rounded-lg font-semibold text-base pf-glow-btn">
              Começar agora — é grátis →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pf-border-subtle py-6 px-6">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Logo size="sm" />
          <p className="text-xs text-pf-text-muted">Construído com Claude Code — No Code Start Up © 2026</p>
        </div>
      </footer>
    </div>
  );
}

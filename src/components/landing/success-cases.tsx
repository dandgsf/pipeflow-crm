"use client";

import { useRef, useEffect, useState } from "react";

const cases = [
  { metric: "+47%", label: "Taxa de Conversão", company: "NexTech Solutions", segment: "SaaS B2B" },
  { metric: "3.2x", label: "Mais Leads Qualificados", company: "Órbita Digital", segment: "Marketing" },
  { metric: "-62%", label: "Tempo de Ciclo de Venda", company: "CloudBridge Inc.", segment: "Consultoria" },
];

function CountUp({ target, suffix = "", prefix = "" }: { target: string; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(prefix + "0" + suffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const numericPart = parseFloat(target.replace(/[^0-9.]/g, ""));
          const isDecimal = target.includes(".");
          const duration = 1500;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = numericPart * eased;
            const formatted = isDecimal ? current.toFixed(1) : Math.round(current).toString();
            setDisplayed(prefix + formatted + suffix);
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, prefix, suffix]);

  return <span ref={ref}>{displayed}</span>;
}

function parseMetric(metric: string) {
  if (metric.startsWith("+")) return { prefix: "+", target: metric.slice(1).replace("%", "").replace("x", ""), suffix: metric.includes("%") ? "%" : "x" };
  if (metric.startsWith("-")) return { prefix: "-", target: metric.slice(1).replace("%", "").replace("x", ""), suffix: metric.includes("%") ? "%" : "x" };
  return { prefix: "", target: metric.replace("%", "").replace("x", ""), suffix: metric.includes("%") ? "%" : "x" };
}

export function SuccessCases() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-4">Resultados reais</div>
        <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-1.5px] leading-[1.15] mb-12">
          Empresas que transformaram<br />seu <span className="text-pf-accent">pipeline</span>.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cases.map((c, i) => {
            const { prefix, target, suffix } = parseMetric(c.metric);
            return (
              <div
                key={i}
                className={`pf-glass rounded-xl p-8 text-center pf-case-float ${
                  i === 1 ? "pf-case-float-delay-1" : i === 2 ? "pf-case-float-delay-2" : ""
                }`}
              >
                <div className="font-display text-[2.8rem] font-extrabold text-pf-accent leading-none mb-2">
                  <CountUp prefix={prefix} target={target} suffix={suffix} />
                </div>
                <div className="text-sm font-semibold text-pf-text mb-1">{c.label}</div>
                <div className="font-mono text-[11px] text-pf-text-muted">{c.company}</div>
                <div className="font-mono text-[10px] text-pf-text-muted/60 mt-0.5">{c.segment}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

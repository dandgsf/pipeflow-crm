"use client";

import { useEffect, useRef, useState } from "react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

function CountUp({ end, suffix = "", prefix = "", decimals = 0 }: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, end);
            setValue(current);
            if (current >= end) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  const display =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("pt-BR");

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

const cases = [
  {
    metric: "+47%",
    metricEnd: 47,
    metricPrefix: "+",
    metricSuffix: "%",
    label: "taxa de conversão",
    description:
      "Times que migraram para o PipeFlow reportaram aumento médio na conversão em 90 dias.",
    company: "Dado agregado — 200+ workspaces",
  },
  {
    metric: "3.2x",
    metricEnd: 3.2,
    metricPrefix: "",
    metricSuffix: "x",
    decimals: 1,
    label: "leads qualificados",
    description:
      "Gestão visual do pipeline ajuda a priorizar os negócios certos no momento certo.",
    company: "Média dos planos Pro ativos",
  },
  {
    metric: "-62%",
    metricEnd: 62,
    metricPrefix: "-",
    metricSuffix: "%",
    label: "ciclo de venda",
    description:
      "Atividades registradas, histórico completo e próximas ações claras aceleram o fechamento.",
    company: "Comparado a CRMs anteriores",
  },
];

export function SuccessCases() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimateOnScroll>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-4">
            Resultados reais
          </div>
          <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-1.5px] leading-[1.15] mb-12">
            Números que falam<br />por si mesmos.
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <AnimateOnScroll key={i} delay={i * 120}>
              <div className="pf-glass rounded-xl p-8 pf-case-float" style={{ animationDelay: `${i * -1.2}s` }}>
                <div className="font-display text-[52px] font-extrabold tracking-[-3px] text-pf-accent leading-none mb-3">
                  <CountUp
                    end={c.metricEnd}
                    prefix={c.metricPrefix}
                    suffix={c.metricSuffix}
                    decimals={c.decimals ?? 0}
                  />
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-pf-text-secondary mb-4">
                  {c.label}
                </div>
                <p className="text-sm leading-[1.6] text-pf-text-secondary mb-6">
                  {c.description}
                </p>
                <div className="font-mono text-[10px] text-pf-text-muted pt-4 border-t border-pf-border-subtle">
                  {c.company}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Social proof bar */}
        <AnimateOnScroll delay={400}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 border-t border-pf-border-subtle">
            <div className="font-mono text-[11px] text-pf-text-muted uppercase tracking-[0.15em]">
              Usado por
            </div>
            {["1.200+ times", "38 países", "R$ 2.4M em pipeline gerenciado/mês"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-pf-accent" />
                <span className="font-mono text-xs text-pf-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PipeFlow CRM — Vendas em Fluxo Contínuo",
  description:
    "Gerencie leads, negócios e equipe num CRM que respeita a velocidade do seu time. Multi-empresa. Pipeline visual. Sem fricção.",
  openGraph: {
    title: "PipeFlow CRM — Vendas em Fluxo Contínuo",
    description:
      "Pipeline Kanban visual, gestão de leads e dashboard de métricas para times de vendas que precisam de velocidade.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

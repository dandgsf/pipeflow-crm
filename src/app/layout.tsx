import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PipeFlow CRM — Vendas em Fluxo Contínuo",
  description:
    "Gerencie leads, negócios e equipe num CRM que respeita a velocidade do seu time. Multi-empresa. Pipeline visual. Sem fricção.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}

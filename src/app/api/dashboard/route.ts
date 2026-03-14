import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/dashboard — métricas agregadas do workspace
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { data: member } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!member) return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });

    const wsId = member.workspace_id;

    // Parallel queries
    const [leadsRes, dealsRes] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("workspace_id", wsId),
      supabase.from("deals").select("id, stage, value").eq("workspace_id", wsId),
    ]);

    const totalLeads = leadsRes.count ?? 0;
    const deals = dealsRes.data ?? [];

    const openDeals = deals.filter(
      (d) => d.stage !== "closed_won" && d.stage !== "closed_lost"
    );
    const closedDeals = deals.filter(
      (d) => d.stage === "closed_won" || d.stage === "closed_lost"
    );
    const wonDeals = deals.filter((d) => d.stage === "closed_won");

    const pipelineValue = openDeals.reduce((s, d) => s + Number(d.value), 0);
    const conversionRate =
      closedDeals.length > 0
        ? (wonDeals.length / closedDeals.length) * 100
        : 0;

    // Funnel data
    const stageOrder = ["new_lead", "contacted", "proposal_sent", "negotiation", "closed_won", "closed_lost"];
    const stageLabels: Record<string, string> = {
      new_lead: "Novo Lead",
      contacted: "Contato Realizado",
      proposal_sent: "Proposta Enviada",
      negotiation: "Negociação",
      closed_won: "Fechado Ganho",
      closed_lost: "Fechado Perdido",
    };

    const funnelData = stageOrder.map((stage) => ({
      stage,
      stage_label: stageLabels[stage],
      count: deals.filter((d) => d.stage === stage).length,
      value: deals.filter((d) => d.stage === stage).reduce((s, d) => s + Number(d.value), 0),
    }));

    // Weekly leads (last 4 weeks)
    const weeklyLeads = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7 - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const { count } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", wsId)
        .gte("created_at", weekStart.toISOString())
        .lt("created_at", weekEnd.toISOString());

      const label = `${String(weekStart.getDate()).padStart(2, "0")}/${String(weekStart.getMonth() + 1).padStart(2, "0")}`;
      weeklyLeads.push({ week: label, count: count ?? 0 });
    }

    // Upcoming deals (next 5 with closest close date)
    const { data: upcomingDeals } = await supabase
      .from("deals")
      .select("*, lead:leads(id, name, company)")
      .eq("workspace_id", wsId)
      .not("stage", "in", '("closed_won","closed_lost")')
      .not("expected_close_date", "is", null)
      .order("expected_close_date", { ascending: true })
      .limit(5);

    return NextResponse.json({
      metrics: {
        total_leads: totalLeads,
        open_deals: openDeals.length,
        pipeline_value: pipelineValue,
        conversion_rate: conversionRate,
      },
      funnel_data: funnelData,
      weekly_leads: weeklyLeads,
      upcoming_deals: upcomingDeals ?? [],
    });
  } catch (err) {
    console.error("[GET /api/dashboard]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

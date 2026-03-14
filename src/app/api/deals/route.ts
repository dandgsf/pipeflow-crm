import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/deals
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = request.nextUrl;
    const stage = searchParams.get("stage");
    const lead_id = searchParams.get("lead_id");

    const { data: member } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!member) return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });

    let query = supabase
      .from("deals")
      .select("*, lead:leads(id, name, company)")
      .eq("workspace_id", member.workspace_id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (stage) query = query.eq("stage", stage);
    if (lead_id) query = query.eq("lead_id", lead_id);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/deals]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST /api/deals
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
    }
    if (!body.lead_id) {
      return NextResponse.json({ error: "Lead é obrigatório" }, { status: 400 });
    }

    const { data: member } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!member) return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });

    const { data, error } = await supabase
      .from("deals")
      .insert({
        workspace_id: member.workspace_id,
        lead_id: body.lead_id,
        title: body.title.trim(),
        value: body.value ?? 0,
        stage: body.stage ?? "new_lead",
        assigned_to: body.assigned_to ?? user.id,
        expected_close_date: body.expected_close_date ?? null,
        position: 0,
      })
      .select("*, lead:leads(id, name, company)")
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/deals]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

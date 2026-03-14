import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/activities?lead_id=X
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = request.nextUrl;
    const lead_id = searchParams.get("lead_id");

    if (!lead_id) {
      return NextResponse.json({ error: "lead_id é obrigatório" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("lead_id", lead_id)
      .order("performed_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/activities]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST /api/activities
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();

    if (!body.lead_id) return NextResponse.json({ error: "lead_id é obrigatório" }, { status: 400 });
    if (!body.type) return NextResponse.json({ error: "type é obrigatório" }, { status: 400 });
    if (!body.description?.trim()) return NextResponse.json({ error: "description é obrigatório" }, { status: 400 });

    const { data: member } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!member) return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });

    const { data, error } = await supabase
      .from("activities")
      .insert({
        workspace_id: member.workspace_id,
        lead_id: body.lead_id,
        deal_id: body.deal_id ?? null,
        type: body.type,
        description: body.description.trim(),
        performed_by: user.id,
        performed_at: body.performed_at ?? new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/activities]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

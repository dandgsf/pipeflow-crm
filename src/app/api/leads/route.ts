import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/leads — lista leads do workspace com filtros opcionais
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const assigned_to = searchParams.get("assigned_to");
    const search = searchParams.get("search");

    // Get workspace_id from first membership
    const { data: member } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!member) return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });

    let query = supabase
      .from("leads")
      .select("*")
      .eq("workspace_id", member.workspace_id)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (assigned_to) query = query.eq("assigned_to", assigned_to);
    if (search) {
      const sanitized = search.replace(/[,().\\]/g, "");
      query = query.or(`name.ilike.%${sanitized}%,company.ilike.%${sanitized}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/leads]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST /api/leads — cria novo lead
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const { data: member } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!member) return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });

    const { data, error } = await supabase
      .from("leads")
      .insert({
        workspace_id: member.workspace_id,
        name: body.name.trim(),
        email: body.email || null,
        phone: body.phone || null,
        company: body.company || null,
        position: body.position || null,
        source: body.source || null,
        notes: body.notes || null,
        status: "new",
        assigned_to: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/leads/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", params.id)
      .eq("workspace_id", member.workspace_id)
      .single();

    if (error || !data) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/leads/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// PUT /api/leads/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json();

    const { data, error } = await supabase
      .from("leads")
      .update({
        name: body.name,
        email: body.email ?? null,
        phone: body.phone ?? null,
        company: body.company ?? null,
        position: body.position ?? null,
        source: body.source ?? null,
        notes: body.notes ?? null,
        status: body.status,
        assigned_to: body.assigned_to ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("workspace_id", member.workspace_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[PUT /api/leads/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/leads/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", params.id)
      .eq("workspace_id", member.workspace_id);
    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/leads/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

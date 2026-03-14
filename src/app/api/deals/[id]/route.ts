import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PUT /api/deals/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.stage !== undefined) updates.stage = body.stage;
    if (body.title !== undefined) updates.title = body.title;
    if (body.value !== undefined) updates.value = body.value;
    if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to;
    if (body.expected_close_date !== undefined) updates.expected_close_date = body.expected_close_date;
    if (body.position !== undefined) updates.position = body.position;
    if (body.stage === "closed_won" || body.stage === "closed_lost") {
      updates.closed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("deals")
      .update(updates)
      .eq("id", params.id)
      .select("*, lead:leads(id, name, company)")
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[PUT /api/deals/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/deals/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { error } = await supabase.from("deals").delete().eq("id", params.id);
    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/deals/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

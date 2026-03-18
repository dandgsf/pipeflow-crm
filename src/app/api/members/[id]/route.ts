import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/members/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    // Verify admin
    const { data: caller } = await supabase
      .from("members")
      .select("workspace_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!caller || caller.role !== "admin") {
      return NextResponse.json({ error: "Apenas admins podem remover membros" }, { status: 403 });
    }

    // Verify target member belongs to same workspace and prevent self-removal
    const { data: target } = await supabase
      .from("members")
      .select("user_id, workspace_id")
      .eq("id", params.id)
      .eq("workspace_id", caller.workspace_id)
      .single();

    if (!target) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }

    if (target.user_id === user.id) {
      return NextResponse.json({ error: "Você não pode remover a si mesmo" }, { status: 400 });
    }

    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", params.id)
      .eq("workspace_id", caller.workspace_id);
    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/members/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/activities/[id]
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
      .from("activities")
      .delete()
      .eq("id", params.id)
      .eq("workspace_id", member.workspace_id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/activities/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

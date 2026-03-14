import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/members — lista membros do workspace
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { data: selfMember } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!selfMember) return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("workspace_id", selfMember.workspace_id)
      .order("joined_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/members]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/types/database";

// POST /api/members/invite
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();
    if (!body.email?.trim()) return NextResponse.json({ error: "E-mail é obrigatório" }, { status: 400 });

    // Verify caller is admin
    const { data: caller } = await supabase
      .from("members")
      .select("workspace_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!caller || caller.role !== "admin") {
      return NextResponse.json({ error: "Apenas admins podem convidar membros" }, { status: 403 });
    }

    // Check plan limits
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("workspace_id", caller.workspace_id)
      .single();

    const plan = subscription?.plan ?? "free";
    const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS].max_members;

    if (limit !== Infinity) {
      const { count } = await supabase
        .from("members")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", caller.workspace_id);

      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          { error: "Limite de membros atingido. Faça upgrade para o plano Pro." },
          { status: 403 }
        );
      }
    }

    // Insert pending member (email only — real invite flow requires Supabase invite)
    const { data, error } = await supabase
      .from("members")
      .insert({
        workspace_id: caller.workspace_id,
        user_id: user.id, // placeholder — replaced when user accepts
        role: body.role ?? "member",
        email: body.email.trim().toLowerCase(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/members/invite]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/subscription — retorna assinatura do workspace do usuário
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    // Get the user's workspace from members table
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { error: "Workspace não encontrado" },
        { status: 404 }
      );
    }

    // Fetch subscription for this workspace
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("workspace_id", member.workspace_id)
      .single();

    if (subError || !subscription) {
      // Return a default free subscription if none exists
      return NextResponse.json({
        workspace_id: member.workspace_id,
        plan: "free",
        status: "active",
        stripe_customer_id: null,
        stripe_subscription_id: null,
        current_period_start: null,
        current_period_end: null,
      });
    }

    return NextResponse.json(subscription);
  } catch (err) {
    console.error("[GET /api/subscription]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/types/database";
import { getResend } from "@/lib/resend";
import { inviteMemberHtml } from "@/components/emails/invite-member";

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

    // Insert pending member (user_id null until invite is accepted)
    const { data, error } = await supabase
      .from("members")
      .insert({
        workspace_id: caller.workspace_id,
        user_id: null,
        role: body.role ?? "member",
        email: body.email.trim().toLowerCase(),
      })
      .select()
      .single();

    if (error) throw error;

    // Send invite email (non-blocking — failure doesn't prevent invite creation)
    try {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("name")
        .eq("id", caller.workspace_id)
        .single();

      const inviteEmail = body.email.trim().toLowerCase();
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?invite=${data.id}&email=${encodeURIComponent(inviteEmail)}`;

      await getResend().emails.send({
        from: "PipeFlow CRM <onboarding@resend.dev>",
        to: [inviteEmail],
        subject: `Convite para ${workspace?.name ?? "workspace"} no PipeFlow`,
        html: inviteMemberHtml({
          workspaceName: workspace?.name ?? "workspace",
          inviteUrl,
          role: body.role ?? "member",
        }),
      });
    } catch (emailErr) {
      console.error("[POST /api/members/invite] Email send failed:", emailErr);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/members/invite]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

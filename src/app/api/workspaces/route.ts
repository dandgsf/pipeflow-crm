import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/workspaces — lista workspaces do usuário
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { data, error } = await supabase
      .from("members")
      .select("workspace_id, role, workspaces(id, name, slug, created_at)")
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/workspaces]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST /api/workspaces — cria novo workspace
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    // Check if user has a pending invite (email-matching, user_id is null)
    const { data: pendingInvite } = await supabase
      .from("members")
      .select("id, workspace_id, workspaces(id, name, slug, created_at)")
      .eq("email", user.email!)
      .is("user_id", null)
      .limit(1)
      .single();

    if (pendingInvite) {
      // Accept invite: update member record with real user_id
      const { error: acceptError } = await supabase
        .from("members")
        .update({ user_id: user.id })
        .eq("id", pendingInvite.id);

      if (acceptError) throw acceptError;

      return NextResponse.json(pendingInvite.workspaces, { status: 200 });
    }

    const body = await request.json();
    if (!body.name?.trim()) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    if (!body.slug?.trim()) return NextResponse.json({ error: "Slug é obrigatório" }, { status: 400 });

    // Create workspace
    const { data: workspace, error: wsError } = await supabase
      .from("workspaces")
      .insert({
        name: body.name.trim(),
        slug: body.slug.trim(),
        created_by: user.id,
      })
      .select()
      .single();

    if (wsError) {
      if (wsError.code === "23505") {
        return NextResponse.json({ error: "Slug já em uso. Escolha outro." }, { status: 409 });
      }
      throw wsError;
    }

    // Create member (admin)
    const { error: memberError } = await supabase
      .from("members")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "admin",
        email: user.email,
      });

    if (memberError) throw memberError;

    // Create subscription (free)
    const { error: subError } = await supabase
      .from("subscriptions")
      .insert({
        workspace_id: workspace.id,
        plan: "free",
        status: "active",
      });

    if (subError) throw subError;

    return NextResponse.json(workspace, { status: 201 });
  } catch (err) {
    console.error("[POST /api/workspaces]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

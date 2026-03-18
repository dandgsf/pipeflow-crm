import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// POST /api/billing/checkout — cria sessão de checkout Stripe
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();
    const { workspace_id } = body;

    if (!workspace_id) {
      return NextResponse.json(
        { error: "workspace_id é obrigatório" },
        { status: 400 }
      );
    }

    // Verify user is a member of this workspace
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("role")
      .eq("workspace_id", workspace_id)
      .eq("user_id", user.id)
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { error: "Workspace não encontrado" },
        { status: 404 }
      );
    }

    // Only admins can create checkout sessions
    if (member.role !== "admin") {
      return NextResponse.json(
        { error: "Apenas administradores podem gerenciar assinaturas" },
        { status: 403 }
      );
    }

    // Get existing subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("workspace_id", workspace_id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 }
      );
    }

    // Look up or create Stripe customer
    let stripeCustomerId = subscription.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          workspace_id,
          user_id: user.id,
        },
      });

      stripeCustomerId = customer.id;

      // Store the Stripe customer ID in the subscription
      await supabase
        .from("subscriptions")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("workspace_id", workspace_id);
    }

    // Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/plans?success=true`,
      cancel_url: `${appUrl}/plans?canceled=true`,
      metadata: {
        workspace_id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[POST /api/billing/checkout]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

/**
 * seed.mjs — Popula o Supabase com dados realistas para o PipeFlow CRM.
 *
 * Uso: node --env-file=.env.local scripts/seed.mjs
 *
 * Cria:
 *  - 1 usuário de teste (via Supabase Auth)
 *  - 1 workspace
 *  - 1 membro (admin)
 *  - 1 subscription (free)
 *  - 10 leads
 *  - 8 deals
 *  - 15 atividades
 */

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_EMAIL = "demo@pipeflow.com";
const TEST_PASSWORD = "demo1234";

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

async function main() {
  console.log("🌱 Seed PipeFlow CRM\n");

  // 1. Create or reuse auth user
  console.log("1/6  Criando usuário de teste...");
  let userId;

  // Try to sign in first (user may already exist)
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

  if (signInData?.user) {
    userId = signInData.user.id;
    console.log("     Usuário já existia:", userId);
  } else {
    const { data: created, error: createErr } =
      await supabase.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: "Demo PipeFlow" },
      });
    if (createErr) {
      console.error("     Erro ao criar usuário:", createErr.message);
      process.exit(1);
    }
    userId = created.user.id;
    console.log("     Usuário criado:", userId);
  }

  // 2. Workspace
  console.log("2/6  Criando workspace...");
  const workspaceId = randomUUID();

  // Clean existing data for this user (idempotent re-runs)
  const { data: existingMember } = await supabase
    .from("members")
    .select("workspace_id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  let wsId = workspaceId;
  if (existingMember) {
    wsId = existingMember.workspace_id;
    console.log("     Workspace já existe:", wsId);
    // Clean old seed data
    await supabase.from("activities").delete().eq("workspace_id", wsId);
    await supabase.from("deals").delete().eq("workspace_id", wsId);
    await supabase.from("leads").delete().eq("workspace_id", wsId);
    console.log("     Dados antigos limpos.");
  } else {
    const { error } = await supabase.from("workspaces").insert({
      id: wsId,
      name: "Acme Corp",
      slug: "acme-corp",
      created_by: userId,
    });
    if (error && !error.message.includes("duplicate")) {
      console.error("     Erro workspace:", error.message);
      process.exit(1);
    }

    // Member
    await supabase.from("members").insert({
      workspace_id: wsId,
      user_id: userId,
      role: "admin",
      email: TEST_EMAIL,
    });

    // Subscription
    await supabase.from("subscriptions").insert({
      workspace_id: wsId,
      plan: "free",
      status: "active",
    });

    console.log("     Workspace criado:", wsId);
  }

  // 3. Leads
  console.log("3/6  Inserindo 10 leads...");
  const leads = [
    { name: "Ana Oliveira", email: "ana@techsolutions.com.br", phone: "(11) 99876-5432", company: "Tech Solutions", position: "Diretora de TI", source: "linkedin", status: "qualified", notes: "Interessada em migrar o CRM atual. Empresa com 50 funcionários." },
    { name: "Carlos Mendes", email: "carlos@inovadata.io", phone: "(21) 98765-4321", company: "InovaData", position: "CEO", source: "indicacao", status: "new", notes: "Indicação do Pedro Almeida. Startup em fase de crescimento." },
    { name: "Beatriz Santos", email: "bia@marketpro.com.br", phone: "(11) 97654-3210", company: "MarketPro", position: "Head de Vendas", source: "google", status: "qualified", notes: "Veio pelo Google Ads. Já usa Pipedrive mas quer alternativa mais barata." },
    { name: "Diego Ferreira", email: "diego@construtiva.eng.br", phone: "(31) 96543-2109", company: "Construtiva Engenharia", position: "Gerente Comercial", source: "evento", status: "new", notes: "Conhecemos no Web Summit. Setor de construção civil." },
    { name: "Fernanda Lima", email: "fernanda@educaplus.com.br", phone: "(41) 95432-1098", company: "EducaPlus", position: "COO", source: "site", status: "qualified", notes: "Cadastro no site. Plataforma de educação corporativa com 200 clientes." },
    { name: "Gabriel Costa", email: "gabriel@logistica360.com", phone: "(51) 94321-0987", company: "Logística 360", position: "Diretor Comercial", source: "indicacao", status: "new", notes: "Indicação da Fernanda. Empresa de logística em expansão nacional." },
    { name: "Helena Rocha", email: "helena@fintechbr.io", phone: "(11) 93210-9876", company: "FintechBR", position: "VP de Vendas", source: "linkedin", status: "qualified", notes: "LinkedIn InMail. Fintech com 100+ colaboradores, buscando CRM escalável." },
    { name: "Igor Nascimento", email: "igor@agroverde.agr.br", phone: "(62) 92109-8765", company: "AgroVerde", position: "Gerente de Negócios", source: "evento", status: "disqualified", notes: "Evento AgroTech. Decidiu manter planilha por enquanto. Revisitar em 6 meses." },
    { name: "Juliana Martins", email: "juliana@designlab.com.br", phone: "(48) 91098-7654", company: "DesignLab Studio", position: "Sócia-Fundadora", source: "site", status: "new", notes: "Agência de design, 15 pessoas. Precisa de CRM para projetos." },
    { name: "Lucas Almeida", email: "lucas@pharmalife.com.br", phone: "(11) 90987-6543", company: "PharmaLife", position: "Diretor de Expansão", source: "google", status: "qualified", notes: "Rede de farmácias, 30 unidades. Pipeline de expansão para novas cidades." },
  ];

  const leadsToInsert = leads.map((l, i) => ({
    ...l,
    workspace_id: wsId,
    assigned_to: userId,
    created_at: daysAgo(30 - i * 3),
  }));

  const { data: insertedLeads, error: leadsErr } = await supabase
    .from("leads")
    .insert(leadsToInsert)
    .select("id, name");

  if (leadsErr) {
    console.error("     Erro leads:", leadsErr.message);
    process.exit(1);
  }
  console.log(`     ${insertedLeads.length} leads inseridos.`);

  // 4. Deals
  console.log("4/6  Inserindo 8 negócios...");
  const leadMap = {};
  insertedLeads.forEach((l) => (leadMap[l.name] = l.id));

  const deals = [
    { title: "Migração CRM Tech Solutions", value: 15000, stage: "negotiation", lead: "Ana Oliveira", close: daysFromNow(10) },
    { title: "Implantação InovaData", value: 8500, stage: "new_lead", lead: "Carlos Mendes", close: daysFromNow(30) },
    { title: "Plano Pro MarketPro", value: 4900, stage: "proposal_sent", lead: "Beatriz Santos", close: daysFromNow(7) },
    { title: "Projeto Construtiva", value: 22000, stage: "contacted", lead: "Diego Ferreira", close: daysFromNow(45) },
    { title: "EducaPlus Enterprise", value: 12000, stage: "closed_won", lead: "Fernanda Lima", close: daysFromNow(-5) },
    { title: "Logística 360 Full", value: 18500, stage: "new_lead", lead: "Gabriel Costa", close: daysFromNow(60) },
    { title: "FintechBR Scale", value: 35000, stage: "proposal_sent", lead: "Helena Rocha", close: daysFromNow(14) },
    { title: "PharmaLife Nacional", value: 45000, stage: "negotiation", lead: "Lucas Almeida", close: daysFromNow(20) },
  ];

  const dealsToInsert = deals.map((d, i) => ({
    title: d.title,
    value: d.value,
    stage: d.stage,
    lead_id: leadMap[d.lead],
    workspace_id: wsId,
    assigned_to: userId,
    expected_close_date: d.close,
    position: i,
    created_at: daysAgo(25 - i * 3),
  }));

  const { data: insertedDeals, error: dealsErr } = await supabase
    .from("deals")
    .insert(dealsToInsert)
    .select("id, title");

  if (dealsErr) {
    console.error("     Erro deals:", dealsErr.message);
    process.exit(1);
  }
  console.log(`     ${insertedDeals.length} negócios inseridos.`);

  // 5. Activities
  console.log("5/6  Inserindo atividades...");
  const activities = [
    { lead: "Ana Oliveira", type: "call", desc: "Primeira ligação. Ana mostrou interesse em migrar do Salesforce. Agendou demo para semana que vem.", ago: 20 },
    { lead: "Ana Oliveira", type: "meeting", desc: "Demo realizada via Zoom. Participaram Ana e o time de TI (3 pessoas). Pediram proposta comercial.", ago: 15 },
    { lead: "Ana Oliveira", type: "email", desc: "Proposta comercial enviada. Plano Enterprise com desconto de 15% para migração.", ago: 12 },
    { lead: "Ana Oliveira", type: "note", desc: "Ana ligou dizendo que está comparando com HubSpot. Precisamos reforçar o diferencial de preço.", ago: 5 },
    { lead: "Carlos Mendes", type: "email", desc: "E-mail de boas-vindas e apresentação do PipeFlow. Aguardando retorno.", ago: 18 },
    { lead: "Beatriz Santos", type: "call", desc: "Ligação de qualificação. Usa Pipedrive mas está insatisfeita com o suporte. Budget aprovado.", ago: 14 },
    { lead: "Beatriz Santos", type: "meeting", desc: "Demo personalizada focando em diferenças vs Pipedrive. Gostou da interface Kanban.", ago: 10 },
    { lead: "Beatriz Santos", type: "email", desc: "Enviada proposta Plano Pro com período de teste estendido de 30 dias.", ago: 7 },
    { lead: "Diego Ferreira", type: "call", desc: "Retorno do contato feito no Web Summit. Interessado mas quer ver ROI primeiro.", ago: 16 },
    { lead: "Fernanda Lima", type: "meeting", desc: "Reunião de fechamento. Aprovado pelo board da EducaPlus.", ago: 8 },
    { lead: "Fernanda Lima", type: "note", desc: "Contrato assinado! Onboarding agendado para semana que vem.", ago: 5 },
    { lead: "Helena Rocha", type: "call", desc: "Cold call via LinkedIn. Helena pediu material sobre segurança e compliance.", ago: 12 },
    { lead: "Helena Rocha", type: "email", desc: "Enviado whitepaper de segurança + case study do setor financeiro.", ago: 10 },
    { lead: "Helena Rocha", type: "meeting", desc: "Demo com equipe técnica da FintechBR. Muito impressionados com o RLS do Supabase.", ago: 6 },
    { lead: "Lucas Almeida", type: "call", desc: "Ligação de follow-up. Lucas quer proposta para 30 unidades com desconto volume.", ago: 3 },
  ];

  const activitiesToInsert = activities.map((a) => ({
    lead_id: leadMap[a.lead],
    workspace_id: wsId,
    type: a.type,
    description: a.desc,
    performed_by: userId,
    performed_at: daysAgo(a.ago),
    created_at: daysAgo(a.ago),
  }));

  const { data: insertedActivities, error: actErr } = await supabase
    .from("activities")
    .insert(activitiesToInsert)
    .select("id");

  if (actErr) {
    console.error("     Erro activities:", actErr.message);
    process.exit(1);
  }
  console.log(`     ${insertedActivities.length} atividades inseridas.`);

  // 6. Done
  console.log("\n✅ Seed completo!");
  console.log(`\n📧 Login: ${TEST_EMAIL}`);
  console.log(`🔑 Senha: ${TEST_PASSWORD}`);
  console.log(`🏢 Workspace: Acme Corp`);
  console.log(`👥 ${insertedLeads.length} leads | 🤝 ${insertedDeals.length} deals | 📋 ${insertedActivities.length} atividades`);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});

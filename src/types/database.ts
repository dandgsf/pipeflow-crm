// ============================================================
// PipeFlow CRM — TypeScript Types
// ============================================================
// Copie este arquivo para: src/types/database.ts
// Estes tipos refletem exatamente o schema.sql do Supabase.
// ============================================================

// ---------- ENUMS ----------

export type MemberRole = 'admin' | 'member';

export type LeadStatus = 'new' | 'qualified' | 'disqualified';

export type DealStage =
  | 'new_lead'
  | 'contacted'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note';

export type SubscriptionPlan = 'free' | 'pro';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

// ---------- TABELAS ----------

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  email: string | null;
  joined_at: string;
}

export interface Subscription {
  id: string;
  workspace_id: string;
  plan: SubscriptionPlan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  workspace_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  position: string | null;
  source: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  workspace_id: string;
  lead_id: string;
  title: string;
  value: number;
  stage: DealStage;
  assigned_to: string | null;
  expected_close_date: string | null;
  closed_at: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  workspace_id: string;
  lead_id: string;
  deal_id: string | null;
  type: ActivityType;
  description: string;
  performed_by: string;
  performed_at: string;
  created_at: string;
}

// ---------- TIPOS AUXILIARES (joins e agregações) ----------

/** Lead com contagem de deals e atividades */
export interface LeadWithCounts extends Lead {
  deals_count: number;
  activities_count: number;
  total_deal_value: number;
}

/** Deal com dados do lead vinculado */
export interface DealWithLead extends Deal {
  lead: Pick<Lead, 'id' | 'name' | 'company'>;
}

/** Activity com nome do autor */
export interface ActivityWithAuthor extends Activity {
  author_name: string;
  author_email: string;
}

/** Member com dados do profile */
export interface MemberWithProfile extends Member {
  user_name: string;
  user_email: string;
}

// ---------- DASHBOARD ----------

export interface DashboardMetrics {
  total_leads: number;
  open_deals: number;
  pipeline_value: number;
  conversion_rate: number; // porcentagem
}

export interface FunnelData {
  stage: DealStage;
  stage_label: string;
  count: number;
  value: number;
}

export interface WeeklyLeadsData {
  week: string; // ex: "10/03" 
  count: number;
}

// ---------- CONSTANTES ----------

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  new_lead: 'Novo Lead',
  contacted: 'Contato Realizado',
  proposal_sent: 'Proposta Enviada',
  negotiation: 'Negociação',
  closed_won: 'Fechado Ganho',
  closed_lost: 'Fechado Perdido',
};

export const DEAL_STAGE_COLORS: Record<DealStage, string> = {
  new_lead: '#3B82F6',      // blue
  contacted: '#06B6D4',     // cyan
  proposal_sent: '#F59E0B', // amber
  negotiation: '#F97316',   // orange
  closed_won: '#22C55E',    // green
  closed_lost: '#EF4444',   // red
};

export const DEAL_STAGE_ORDER: DealStage[] = [
  'new_lead',
  'contacted',
  'proposal_sent',
  'negotiation',
  'closed_won',
  'closed_lost',
];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: 'Ligação',
  email: 'E-mail',
  meeting: 'Reunião',
  note: 'Nota',
};

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
  call: '📞',
  email: '📧',
  meeting: '🤝',
  note: '📝',
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Novo',
  qualified: 'Qualificado',
  disqualified: 'Desqualificado',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#3B82F6',
  qualified: '#22C55E',
  disqualified: '#6B7280',
};

// ---------- LIMITES POR PLANO ----------

export const PLAN_LIMITS: Record<SubscriptionPlan, { max_members: number; max_leads: number }> = {
  free: { max_members: 2, max_leads: 50 },
  pro: { max_members: Infinity, max_leads: Infinity },
};

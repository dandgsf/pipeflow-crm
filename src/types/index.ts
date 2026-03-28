// ─── Workspace ───────────────────────────────────────────────────────────────

export type WorkspacePlan = 'free' | 'pro'
export type MemberRole = 'admin' | 'member'

export interface Workspace {
  id: string
  name: string
  slug: string
  plan: WorkspacePlan
  created_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: MemberRole
  created_at: string
  // Joined fields
  user?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export type LeadStatus =
  | 'novo'
  | 'contato'
  | 'proposta'
  | 'negociacao'
  | 'ganho'
  | 'perdido'

export interface Lead {
  id: string
  workspace_id: string
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: LeadStatus
  owner_id?: string
  notes?: string
  estimated_value?: number
  created_at: string
  updated_at: string
  // Joined fields
  owner?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

// ─── Deal / Pipeline ─────────────────────────────────────────────────────────

export type PipelineStage =
  | 'novo_lead'
  | 'contato_realizado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido'

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'novo_lead', label: 'Novo Lead' },
  { id: 'contato_realizado', label: 'Contato Realizado' },
  { id: 'proposta_enviada', label: 'Proposta Enviada' },
  { id: 'negociacao', label: 'Negociação' },
  { id: 'fechado_ganho', label: 'Fechado Ganho' },
  { id: 'fechado_perdido', label: 'Fechado Perdido' },
]

export interface Deal {
  id: string
  workspace_id: string
  lead_id: string
  title: string
  stage: PipelineStage
  position: number
  estimated_value?: number
  owner_id?: string
  due_date?: string
  notes?: string
  created_at: string
  updated_at: string
  // Joined fields
  lead?: Pick<Lead, 'id' | 'name' | 'company' | 'email'>
  owner?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export type ActivityType = 'call' | 'email' | 'meeting' | 'note'

export interface Activity {
  id: string
  workspace_id: string
  lead_id: string
  type: ActivityType
  title: string
  description?: string
  occurred_at: string
  created_by?: string
  created_at: string
  // Joined fields
  creator?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export interface Subscription {
  id: string
  workspace_id: string
  plan: WorkspacePlan
  stripe_customer_id?: string
  stripe_subscription_id?: string
  current_period_end?: string
  created_at: string
  updated_at: string
}

// ─── Invite ───────────────────────────────────────────────────────────────────

export interface WorkspaceInvite {
  id: string
  workspace_id: string
  email: string
  role: MemberRole
  token: string
  expires_at: string
  accepted_at?: string
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Workaround: Lead has no avatar_url in DB but we may join avatar from auth.users
declare module './index' {
  interface Lead {
    avatar_url?: string
  }
}

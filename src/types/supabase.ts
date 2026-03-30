// ============================================================
// src/types/supabase.ts
// Tipos gerados manualmente refletindo o schema do banco.
// Quando o projeto estiver em produção, substitua com:
//   Dashboard → Settings → API → Generate TypeScript Types
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ── workspaces ──────────────────────────────────────────
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          plan: 'free' | 'pro' | 'payment_failed'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: 'free' | 'pro' | 'payment_failed'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: 'free' | 'pro' | 'payment_failed'
          created_at?: string
        }
        Relationships: []
      }

      // ── workspace_members ───────────────────────────────────
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workspace_members_workspace_id_fkey'
            columns: ['workspace_id']
            isOneToOne: false
            referencedRelation: 'workspaces'
            referencedColumns: ['id']
          },
        ]
      }

      // ── workspace_invites ───────────────────────────────────
      workspace_invites: {
        Row: {
          id: string
          workspace_id: string
          email: string
          role: 'admin' | 'member'
          token: string
          expires_at: string
          accepted_at: string | null
          invited_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          email: string
          role?: 'admin' | 'member'
          token?: string
          expires_at?: string
          accepted_at?: string | null
          invited_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          email?: string
          role?: 'admin' | 'member'
          token?: string
          expires_at?: string
          accepted_at?: string | null
          invited_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workspace_invites_workspace_id_fkey'
            columns: ['workspace_id']
            isOneToOne: false
            referencedRelation: 'workspaces'
            referencedColumns: ['id']
          },
        ]
      }

      // ── leads ───────────────────────────────────────────────
      leads: {
        Row: {
          id: string
          workspace_id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          position: string | null
          status: 'novo' | 'contato' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'
          owner_id: string | null
          notes: string | null
          estimated_value: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          position?: string | null
          status?: 'novo' | 'contato' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'
          owner_id?: string | null
          notes?: string | null
          estimated_value?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          position?: string | null
          status?: 'novo' | 'contato' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'
          owner_id?: string | null
          notes?: string | null
          estimated_value?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_workspace_id_fkey'
            columns: ['workspace_id']
            isOneToOne: false
            referencedRelation: 'workspaces'
            referencedColumns: ['id']
          },
        ]
      }

      // ── deals ───────────────────────────────────────────────
      deals: {
        Row: {
          id: string
          workspace_id: string
          lead_id: string
          title: string
          stage:
            | 'novo_lead'
            | 'contato_realizado'
            | 'proposta_enviada'
            | 'negociacao'
            | 'fechado_ganho'
            | 'fechado_perdido'
          position: number
          estimated_value: number | null
          owner_id: string | null
          due_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          lead_id: string
          title: string
          stage?:
            | 'novo_lead'
            | 'contato_realizado'
            | 'proposta_enviada'
            | 'negociacao'
            | 'fechado_ganho'
            | 'fechado_perdido'
          position?: number
          estimated_value?: number | null
          owner_id?: string | null
          due_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          lead_id?: string
          title?: string
          stage?:
            | 'novo_lead'
            | 'contato_realizado'
            | 'proposta_enviada'
            | 'negociacao'
            | 'fechado_ganho'
            | 'fechado_perdido'
          position?: number
          estimated_value?: number | null
          owner_id?: string | null
          due_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'deals_workspace_id_fkey'
            columns: ['workspace_id']
            isOneToOne: false
            referencedRelation: 'workspaces'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deals_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }

      // ── subscriptions ───────────────────────────────────────
      subscriptions: {
        Row: {
          id: string
          workspace_id: string
          plan: 'free' | 'pro' | 'payment_failed'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          plan?: 'free' | 'pro' | 'payment_failed'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          plan?: 'free' | 'pro' | 'payment_failed'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_workspace_id_fkey'
            columns: ['workspace_id']
            isOneToOne: true
            referencedRelation: 'workspaces'
            referencedColumns: ['id']
          },
        ]
      }

      // ── activities ──────────────────────────────────────────
      activities: {
        Row: {
          id: string
          workspace_id: string
          lead_id: string
          type: 'call' | 'email' | 'meeting' | 'note'
          title: string
          description: string | null
          occurred_at: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          lead_id: string
          type: 'call' | 'email' | 'meeting' | 'note'
          title: string
          description?: string | null
          occurred_at?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          lead_id?: string
          type?: 'call' | 'email' | 'meeting' | 'note'
          title?: string
          description?: string | null
          occurred_at?: string
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activities_workspace_id_fkey'
            columns: ['workspace_id']
            isOneToOne: false
            referencedRelation: 'workspaces'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }

    }

    Views: {
      [_ in never]: never
    }

    Functions: {
      is_workspace_member: {
        Args: { p_workspace_id: string }
        Returns: boolean
      }
      is_workspace_admin: {
        Args: { p_workspace_id: string }
        Returns: boolean
      }
    }

    Enums: {
      [_ in never]: never
    }
  }
}

// ─── Helpers de conveniência ──────────────────────────────────────────────────
// Extrai o tipo Row de qualquer tabela sem precisar digitar o caminho completo.

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Exemplos de uso:
//   type Workspace      = Tables<'workspaces'>
//   type LeadInsert     = TablesInsert<'leads'>
//   type DealUpdate     = TablesUpdate<'deals'>

"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Trash2, Crown, UserCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InviteMemberDialog } from "@/components/members/invite-member-dialog";
import { useUser } from "@/hooks/use-user";
import { formatDate } from "@/lib/utils";
import type { Member, MemberRole } from "@/types/database";

const ROLE_LABELS: Record<MemberRole, string> = {
  admin: "Admin",
  member: "Membro",
};

export default function MembersPage() {
  const { user, loading: userLoading } = useUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/members");
      if (!res.ok) throw new Error("Erro ao carregar membros");
      const data: Member[] = await res.json();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Determine if the current user is admin
  const currentMember = members.find((m) => m.user_id === user?.id);
  const isAdmin = currentMember?.role === "admin";

  // Check if on free plan with 2+ members (show upgrade message)
  const isFreePlanLimited = members.length >= 2;

  async function handleRemove(memberId: string) {
    if (!confirm("Tem certeza que deseja remover este membro?")) return;
    setRemovingId(memberId);
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao remover membro");
      }
      await fetchMembers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao remover membro");
    } finally {
      setRemovingId(null);
    }
  }

  function getInitial(member: Member): string {
    if (member.email) return member.email[0].toUpperCase();
    return "?";
  }

  function getDisplayName(member: Member): string {
    return member.email ?? "Membro pendente";
  }

  const isLoading = loading || userLoading;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight text-pf-text">
            Membros
          </h1>
          {!isLoading && (
            <Badge className="border-pf-border bg-pf-surface-2 text-pf-text-secondary">
              {members.length}
            </Badge>
          )}
        </div>
        {isAdmin && <InviteMemberDialog onInvited={fetchMembers} />}
      </div>

      {/* Free plan upgrade message */}
      {isAdmin && isFreePlanLimited && !loading && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-300">
              Limite do plano Free
            </p>
            <p className="mt-0.5 text-sm text-amber-400/70">
              O plano gratuito permite at&eacute; 2 membros. Para adicionar mais,
              fa&ccedil;a upgrade para o plano Pro.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-pf-text-muted" />
        </div>
      ) : error ? (
        <p className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <UserCircle className="h-12 w-12 text-pf-text-muted" />
          <p className="mt-3 text-pf-text-secondary">
            Nenhum membro encontrado.
          </p>
        </div>
      ) : (
        /* Members list */
        <div className="rounded-lg border border-pf-border bg-pf-surface">
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-pf-border-subtle px-4 py-3 text-xs font-medium uppercase tracking-wider text-pf-text-muted">
            <span>Membro</span>
            <span className="hidden sm:block">Papel</span>
            <span className="hidden md:block">Entrou em</span>
            <span className="w-10" />
          </div>

          {members.map((member) => {
            const isSelf = member.user_id === user?.id;
            return (
              <div
                key={member.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-pf-border-subtle px-4 py-3 last:border-b-0 transition-colors hover:bg-pf-surface-2/50"
              >
                {/* Avatar + Name + Email */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pf-accent/10 text-sm font-semibold text-pf-accent">
                    {getInitial(member)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-pf-text">
                      {getDisplayName(member)}
                      {isSelf && (
                        <span className="ml-2 text-xs text-pf-text-muted">
                          (voc&ecirc;)
                        </span>
                      )}
                    </p>
                    {member.email && (
                      <p className="truncate text-xs text-pf-text-muted">
                        {member.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role badge */}
                <div className="hidden sm:block">
                  {member.role === "admin" ? (
                    <Badge className="gap-1 border-pf-accent/30 bg-pf-accent/10 text-pf-accent">
                      <Crown className="h-3 w-3" />
                      {ROLE_LABELS[member.role]}
                    </Badge>
                  ) : (
                    <Badge className="border-pf-border bg-pf-surface-2 text-pf-text-secondary">
                      {ROLE_LABELS[member.role]}
                    </Badge>
                  )}
                </div>

                {/* Joined date */}
                <span className="hidden text-sm text-pf-text-muted md:block">
                  {formatDate(member.joined_at)}
                </span>

                {/* Actions */}
                <div className="w-10 text-right">
                  {isAdmin && !isSelf && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-pf-text-muted hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => handleRemove(member.id)}
                      disabled={removingId === member.id}
                      title="Remover membro"
                    >
                      {removingId === member.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

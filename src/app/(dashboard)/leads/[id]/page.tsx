"use client";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadProfile } from "@/components/leads/lead-profile";
import { ActivityTimeline } from "@/components/activities/activity-timeline";
import { NewActivityDialog } from "@/components/activities/new-activity-dialog";
import { useLeadDetail } from "@/hooks/use-lead-detail";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { lead, deals, activities, loading, error, createActivity } = useLeadDetail(params.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !lead) {
    if (error?.includes("não encontrado")) notFound();
    return <p className="p-6 text-sm text-destructive">{error}</p>;
  }

  // Cast to LeadWithCounts for LeadProfile (counts not available from API, use 0)
  const leadWithCounts = {
    ...lead,
    deals_count: deals.length,
    activities_count: activities.length,
    total_deal_value: deals.reduce((s, d) => s + d.value, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Detalhe do Lead</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <LeadProfile lead={leadWithCounts} deals={deals} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Atividades ({activities.length})
            </CardTitle>
            <NewActivityDialog onCreated={createActivity} />
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadProfile } from "@/components/leads/lead-profile";
import { ActivityTimeline } from "@/components/activities/activity-timeline";
import { NewActivityDialog } from "@/components/activities/new-activity-dialog";
import {
  getLeadById,
  getActivitiesByLeadId,
  getDealsByLeadId,
} from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const lead = getLeadById(id);

  if (!lead) {
    notFound();
  }

  const activities = getActivitiesByLeadId(id);
  const deals = getDealsByLeadId(id);

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
        {/* Left column: Profile */}
        <LeadProfile lead={lead} deals={deals} />

        {/* Right column: Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Atividades ({activities.length})
            </CardTitle>
            <NewActivityDialog />
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

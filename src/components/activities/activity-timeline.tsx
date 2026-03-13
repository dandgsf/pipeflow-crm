"use client";

import { ActivityWithAuthor, ACTIVITY_TYPE_LABELS } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Phone, Mail, Handshake, StickyNote } from "lucide-react";

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Handshake,
  note: StickyNote,
};

const activityColors = {
  call: "bg-blue-100 text-blue-600",
  email: "bg-purple-100 text-purple-600",
  meeting: "bg-amber-100 text-amber-600",
  note: "bg-gray-100 text-gray-600",
};

interface ActivityTimelineProps {
  activities: ActivityWithAuthor[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Nenhuma atividade registrada.
      </p>
    );
  }

  return (
    <div className="relative space-y-0">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];
        const isLast = index === activities.length - 1;

        return (
          <div key={activity.id} className="relative flex gap-4 pb-8">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-5 top-10 h-full w-px bg-border" />
            )}
            {/* Icon */}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {ACTIVITY_TYPE_LABELS[activity.type]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(activity.performed_at)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                por {activity.author_name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

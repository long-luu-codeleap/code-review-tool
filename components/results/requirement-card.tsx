"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, ThumbsUp, ArrowUpCircle } from "lucide-react";
import type { RequirementScore } from "@/lib/types";

interface RequirementCardProps {
  data: RequirementScore;
}

const statusConfig = {
  pass: {
    icon: CheckCircle2,
    label: "Pass",
    variant: "default" as const,
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  partial: {
    icon: AlertCircle,
    label: "Partial",
    variant: "default" as const,
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  fail: {
    icon: XCircle,
    label: "Fail",
    variant: "default" as const,
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

export function RequirementCard({ data }: RequirementCardProps) {
  // Defensive: handle unexpected status values from AI
  const normalizedStatus = (data.status || "fail").toLowerCase().trim() as keyof typeof statusConfig;
  const config = statusConfig[normalizedStatus] || statusConfig.fail;
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-sm font-medium leading-snug">
            {data.requirement}
          </CardTitle>
          <Badge variant={config.variant} className={`shrink-0 ${config.className}`}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label} ({data.score}/10)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {data.positives.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-green-600">
              <ThumbsUp className="h-3 w-3" />
              Strengths
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {data.positives.map((p, i) => (
                <li key={i} className="pl-4">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.improvements.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-yellow-600">
              <ArrowUpCircle className="h-3 w-3" />
              Improvements
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {data.improvements.map((imp, i) => (
                <li key={i} className="pl-4">
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

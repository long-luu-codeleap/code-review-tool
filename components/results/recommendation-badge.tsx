"use client";

import { Badge } from "@/components/ui/badge";
import { ThumbsUp, HelpCircle, ThumbsDown } from "lucide-react";

interface RecommendationBadgeProps {
  recommendation: "Proceed" | "Consider" | "Reject";
}

const config = {
  Proceed: {
    icon: ThumbsUp,
    label: "Proceed to Interview",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  Consider: {
    icon: HelpCircle,
    label: "Consider with Reservations",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  Reject: {
    icon: ThumbsDown,
    label: "Reject",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

export function RecommendationBadge({
  recommendation,
}: RecommendationBadgeProps) {
  const { icon: Icon, label, className } = config[recommendation];

  return (
    <Badge variant="outline" className={`gap-1 px-3 py-1.5 text-sm ${className}`}>
      <Icon className="h-4 w-4" />
      {label}
    </Badge>
  );
}

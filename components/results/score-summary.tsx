"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Pass3Output } from "@/lib/types";

interface ScoreSummaryProps {
  data: Pass3Output;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-500";
  if (score >= 6) return "text-yellow-500";
  return "text-red-500";
}

function getProgressColor(score: number, max: number): string {
  const ratio = score / max;
  if (ratio >= 0.8) return "[&>div]:bg-green-500";
  if (ratio >= 0.6) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
}

export function ScoreSummary({ data }: ScoreSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Overall Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-baseline justify-center gap-1">
          <span className={`text-6xl font-bold ${getScoreColor(data.overallScore)}`}>
            {data.overallScore}
          </span>
          <span className="text-2xl text-muted-foreground">/ 10</span>
        </div>

        <div className="mb-6 text-center text-sm text-muted-foreground">
          Candidate Level:{" "}
          <span className="font-semibold text-foreground">
            {data.candidateLevel}
          </span>
        </div>

        <div className="space-y-3">
          {data.sectionScores.map((section) => (
            <div key={section.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{section.name}</span>
                <span className="font-medium">
                  {section.score}/{section.maxScore}
                </span>
              </div>
              <Progress
                value={(section.score / section.maxScore) * 100}
                className={`h-2 ${getProgressColor(section.score, section.maxScore)}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

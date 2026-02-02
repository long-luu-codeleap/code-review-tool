"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreSummary } from "./score-summary";
import { RequirementCard } from "./requirement-card";
import { RecommendationBadge } from "./recommendation-badge";
import { ExportToolbar } from "./export-toolbar";
import type { EvaluationResult } from "@/lib/types";

interface EvaluationReportProps {
  result: EvaluationResult;
}

export function EvaluationReport({ result }: EvaluationReportProps) {
  const { pass2, pass3 } = result;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Evaluation Report</h1>
          <p className="text-muted-foreground">
            AI-powered code assessment results
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RecommendationBadge recommendation={pass3.recommendation} />
          <ExportToolbar result={result} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <ScoreSummary data={pass3} />

          {pass3.keyTakeaways.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {pass3.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Report</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {pass3.markdownReport}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="mb-4 text-xl font-semibold">Requirement Breakdown</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {pass2.requirements.map((req, i) => (
            <RequirementCard key={i} data={req} />
          ))}
        </div>
      </div>
    </div>
  );
}

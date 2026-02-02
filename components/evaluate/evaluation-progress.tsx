"use client";

import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { EvaluationPass } from "@/lib/types";

interface EvaluationProgressProps {
  currentPass: EvaluationPass | null;
}

const steps = [
  { pass: 1 as const, label: "Structure Scan", description: "Analyzing project structure and code quality" },
  { pass: 2 as const, label: "Requirement Review", description: "Evaluating against requirements" },
  { pass: 3 as const, label: "Final Scoring", description: "Generating report and scores" },
];

export function EvaluationProgress({ currentPass }: EvaluationProgressProps) {
  if (currentPass === null) return null;

  return (
    <Card>
      <CardContent className="py-6">
        <div className="space-y-4">
          {steps.map((step) => {
            const isActive = currentPass === step.pass;
            const isComplete = currentPass > step.pass;

            return (
              <div key={step.pass} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-foreground"
                        : isComplete
                        ? "text-muted-foreground"
                        : "text-muted-foreground/40"
                    }`}
                  >
                    Pass {step.pass}: {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

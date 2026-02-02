"use client";

import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  FileText,
  Play,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { SourceInput } from "./source-input";
import { TemplateEditor } from "./template-editor";
import { EvaluationProgress } from "./evaluation-progress";
import { useEvaluation } from "@/lib/hooks/use-evaluation";
import { DEFAULT_REQUIREMENT_TEMPLATE } from "@/lib/templates/default-requirement";
import { DEFAULT_RESULT_TEMPLATE } from "@/lib/templates/default-result";

export function EvaluationForm() {
  const router = useRouter();
  const {
    sourceData,
    requirementTemplate,
    resultTemplate,
    currentPass,
    isLoading,
    error,
    setRequirementTemplate,
    setResultTemplate,
    handleSourceLoaded,
    handleError,
    runEvaluation,
  } = useEvaluation();

  async function handleEvaluate() {
    const result = await runEvaluation();
    if (result) {
      try {
        sessionStorage.setItem("evaluationResult", JSON.stringify(result));
        router.push("/results");
      } catch {
        toast.error(
          "Failed to store results. The evaluation may be too large.",
        );
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Evaluate Assignment</h1>
        <p className="text-muted-foreground">
          AI-powered code assessment for technical hiring
        </p>
      </div>

      <SourceInput
        sourceData={sourceData}
        onSourceLoaded={handleSourceLoaded}
        onError={handleError}
      />

      <TemplateEditor
        title="Requirement Template"
        description="Defines the assessment criteria and features to evaluate. Customize this to match your job requirements."
        icon={<ClipboardCheck className="h-5 w-5" />}
        value={requirementTemplate}
        defaultValue={DEFAULT_REQUIREMENT_TEMPLATE}
        onChange={setRequirementTemplate}
      />

      <TemplateEditor
        title="Result Template"
        description="Shapes the format of the evaluation report. Modify sections to focus on what matters most to your team."
        icon={<FileText className="h-5 w-5" />}
        value={resultTemplate}
        defaultValue={DEFAULT_RESULT_TEMPLATE}
        onChange={setResultTemplate}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading && <EvaluationProgress currentPass={currentPass} />}

      <Button
        onClick={handleEvaluate}
        disabled={!sourceData || isLoading}
        size="lg"
        className="w-full cursor-pointer"
      >
        {isLoading ? (
          "Evaluating..."
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Evaluate
          </>
        )}
      </Button>
    </div>
  );
}

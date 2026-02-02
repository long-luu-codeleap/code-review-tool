"use client";

import { useState, useCallback } from "react";
import { DEFAULT_REQUIREMENT_TEMPLATE } from "@/lib/templates/default-requirement";
import { DEFAULT_RESULT_TEMPLATE } from "@/lib/templates/default-result";
import type {
  SourceData,
  EvaluationPass,
  EvaluationResult,
} from "@/lib/types";

export function useEvaluation() {
  const [sourceData, setSourceData] = useState<SourceData | null>(null);
  const [requirementTemplate, setRequirementTemplate] = useState(
    DEFAULT_REQUIREMENT_TEMPLATE
  );
  const [resultTemplate, setResultTemplate] = useState(
    DEFAULT_RESULT_TEMPLATE
  );
  const [currentPass, setCurrentPass] = useState<EvaluationPass | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleSourceLoaded = useCallback((data: SourceData) => {
    setSourceData(data);
    setError(null);
  }, []);

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const runEvaluation = useCallback(async () => {
    if (!sourceData) {
      setError("Please load source code first");
      return null;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate pass progression for UI feedback
      setCurrentPass(1);
      const passTimer = setInterval(() => {
        setCurrentPass((prev) => {
          if (prev === 1) return 2;
          if (prev === 2) return 3;
          return prev;
        });
      }, 8000);

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: sourceData.sourceCode,
          fileTree: sourceData.fileTree,
          requirementTemplate,
          resultTemplate,
        }),
      });

      const data = await res.json();

      clearInterval(passTimer);

      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      setResult(data);
      setCurrentPass(null);
      return data as EvaluationResult;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Evaluation failed";
      setError(message);
      setCurrentPass(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sourceData, requirementTemplate, resultTemplate]);

  return {
    sourceData,
    requirementTemplate,
    resultTemplate,
    currentPass,
    isLoading,
    error,
    result,
    setRequirementTemplate,
    setResultTemplate,
    handleSourceLoaded,
    handleError,
    runEvaluation,
  };
}

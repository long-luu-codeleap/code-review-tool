"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EvaluationReport } from "@/components/results/evaluation-report";
import type { EvaluationResult } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("evaluationResult");
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch {
      // Invalid data in session storage
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!result) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
        <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">No Results Found</h2>
        <p className="mb-6 text-muted-foreground">
          Run an evaluation first to see results here.
        </p>
        <Button onClick={() => router.push("/evaluate")}>Go to Evaluate</Button>
      </div>
    );
  }

  return <EvaluationReport result={result} />;
}

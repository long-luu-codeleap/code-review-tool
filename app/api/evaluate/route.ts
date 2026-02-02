import { NextResponse } from "next/server";
import { z } from "zod";
import { runEvaluation } from "@/lib/ai/evaluate-pipeline";
import { MAX_SOURCE_CODE_LENGTH } from "@/lib/constants";

const RequestSchema = z.object({
  sourceCode: z
    .string()
    .min(1, "Source code is required")
    .max(MAX_SOURCE_CODE_LENGTH, "Source code exceeds maximum length"),
  fileTree: z.array(z.string()),
  requirementTemplate: z.string().min(1, "Requirement template is required"),
  resultTemplate: z.string().min(1, "Result template is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.parse(body);

    const result = await runEvaluation(parsed);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    console.error("Evaluation error:", error);
    const message =
      error instanceof Error ? error.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

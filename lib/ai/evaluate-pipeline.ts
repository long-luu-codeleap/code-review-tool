import { generateContent } from "./gemini-client";
import {
  SYSTEM_PROMPT,
  buildPass1Prompt,
  buildPass2Prompt,
  buildPass3Prompt,
} from "./prompts";
import type {
  EvaluationInput,
  EvaluationResult,
  Pass1Output,
  Pass2Output,
  Pass3Output,
} from "@/lib/types";

function cleanJsonResponse(text: string): string {
  // Remove markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

export async function runEvaluation(
  input: EvaluationInput
): Promise<EvaluationResult> {
  // Pass 1: Structure Scan
  const pass1Raw = await generateContent(
    SYSTEM_PROMPT,
    buildPass1Prompt(input.sourceCode)
  );
  const pass1: Pass1Output = JSON.parse(cleanJsonResponse(pass1Raw));

  // Pass 2: Requirement Review
  const pass2Raw = await generateContent(
    SYSTEM_PROMPT,
    buildPass2Prompt(
      input.sourceCode,
      input.requirementTemplate,
      JSON.stringify(pass1, null, 2)
    )
  );
  const pass2: Pass2Output = JSON.parse(cleanJsonResponse(pass2Raw));

  // Pass 3: Final Scoring
  const pass3Raw = await generateContent(
    SYSTEM_PROMPT,
    buildPass3Prompt(
      JSON.stringify(pass1, null, 2),
      JSON.stringify(pass2, null, 2),
      input.resultTemplate
    )
  );

  // Split markdown and JSON
  const delimiter = "---JSON_DATA---";
  const delimiterIndex = pass3Raw.indexOf(delimiter);

  let markdownReport: string;
  let pass3Json: Omit<Pass3Output, "markdownReport">;

  if (delimiterIndex !== -1) {
    markdownReport = pass3Raw.substring(0, delimiterIndex).trim();
    const jsonPart = pass3Raw.substring(delimiterIndex + delimiter.length).trim();
    pass3Json = JSON.parse(cleanJsonResponse(jsonPart));
  } else {
    // Fallback: try to find JSON at the end
    const lastBrace = pass3Raw.lastIndexOf("}");
    const firstBrace = pass3Raw.lastIndexOf(
      "{",
      pass3Raw.lastIndexOf('"sectionScores"')
    );
    if (firstBrace !== -1 && lastBrace !== -1) {
      markdownReport = pass3Raw.substring(0, firstBrace).trim();
      pass3Json = JSON.parse(pass3Raw.substring(firstBrace, lastBrace + 1));
    } else {
      markdownReport = pass3Raw;
      pass3Json = {
        overallScore: 0,
        candidateLevel: "Junior",
        recommendation: "Consider",
        keyTakeaways: ["Unable to parse structured scoring"],
        sectionScores: [],
      };
    }
  }

  const pass3: Pass3Output = {
    ...pass3Json,
    markdownReport,
  };

  return { pass1, pass2, pass3 };
}

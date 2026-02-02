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
  cleaned = cleaned.trim();

  // Try to extract JSON if wrapped in other text
  // Look for the outermost { ... } braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function attemptJsonRepair(jsonString: string): string {
  // Attempt to fix common JSON formatting issues from AI responses
  let repaired = jsonString;

  // Fix unescaped backslashes in Windows paths
  // Convert single backslashes to double backslashes (except for valid escape sequences)
  repaired = repaired.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');

  return repaired;
}

function parseJsonWithContext(jsonString: string, context: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // Try to repair common JSON issues
    try {
      const repaired = attemptJsonRepair(jsonString);
      return JSON.parse(repaired);
    } catch (repairError) {
      // Repair failed, provide detailed error context
      const errorMsg = error instanceof Error ? error.message : String(error);
      const match = errorMsg.match(/position (\d+)/);

      if (match) {
        const position = parseInt(match[1], 10);
        const start = Math.max(0, position - 100);
        const end = Math.min(jsonString.length, position + 100);
        const snippet = jsonString.substring(start, end);
        const pointer = ' '.repeat(Math.min(position - start, 100)) + '^';

        throw new Error(
          `${context} - JSON parsing failed: ${errorMsg}\n\n` +
          `Snippet near error:\n${snippet}\n${pointer}\n\n` +
          `This is likely an AI response formatting issue. Please retry the evaluation.`
        );
      }

      throw new Error(
        `${context} - JSON parsing failed: ${errorMsg}\n` +
        `This is likely an AI response formatting issue. Please retry the evaluation.`
      );
    }
  }
}

export async function runEvaluation(
  input: EvaluationInput
): Promise<EvaluationResult> {
  // Pass 1: Structure Scan
  const pass1Raw = await generateContent(
    SYSTEM_PROMPT,
    buildPass1Prompt(input.sourceCode)
  );
  const pass1Cleaned = cleanJsonResponse(pass1Raw);
  const pass1: Pass1Output = parseJsonWithContext(pass1Cleaned, "Pass 1 (Structure Scan)");

  // Pass 2: Requirement Review
  const pass2Raw = await generateContent(
    SYSTEM_PROMPT,
    buildPass2Prompt(
      input.sourceCode,
      input.requirementTemplate,
      JSON.stringify(pass1, null, 2)
    )
  );
  const pass2Cleaned = cleanJsonResponse(pass2Raw);
  const pass2: Pass2Output = parseJsonWithContext(pass2Cleaned, "Pass 2 (Requirement Review)");

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
    const pass3Cleaned = cleanJsonResponse(jsonPart);
    pass3Json = parseJsonWithContext(pass3Cleaned, "Pass 3 (Final Scoring)");
  } else {
    // Fallback: try to find JSON at the end
    const lastBrace = pass3Raw.lastIndexOf("}");
    const firstBrace = pass3Raw.lastIndexOf(
      "{",
      pass3Raw.lastIndexOf('"sectionScores"')
    );
    if (firstBrace !== -1 && lastBrace !== -1) {
      markdownReport = pass3Raw.substring(0, firstBrace).trim();
      const fallbackJson = pass3Raw.substring(firstBrace, lastBrace + 1);
      pass3Json = parseJsonWithContext(fallbackJson, "Pass 3 (Final Scoring - Fallback)");
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

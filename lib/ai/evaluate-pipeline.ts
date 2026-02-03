import { generateWithFallback } from "./provider-manager";
import { prepareSourceCode } from "@/lib/utils/source-compression";
import { validatePass1, validatePass2, validatePass3 } from "./validators";
import type { AIProvider } from "./types";
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

function normalizeStatus(
  status: string,
): "pass" | "partial" | "fail" {
  // Normalize status values from AI responses to expected values
  const normalized = (status || "fail").toLowerCase().trim();

  if (normalized === "pass" || normalized === "passed" || normalized === "passing") {
    return "pass";
  }
  if (normalized === "partial" || normalized === "partially" || normalized === "partial pass") {
    return "partial";
  }
  // Default to fail for any unexpected values
  return "fail";
}

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
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function attemptJsonRepair(jsonString: string): string {
  // Attempt to fix common JSON formatting issues from AI responses

  // Step 1: Fix unescaped backslashes in Windows paths
  // Convert single backslashes to double backslashes (except for valid JSON escape sequences)
  // Valid sequences: \" \\ \/ \b \f \n \r \t \u (hence the regex: bfnrtu)
  const repaired = jsonString.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

  // Step 2: Fix unescaped quotes within string values using a state machine
  // This is a common issue with AI-generated JSON where quotes appear in text like "thoroughly tested"
  let result = "";
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];

    // Handle escape sequences
    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escapeNext = true;
      continue;
    }

    // Handle quotes
    if (char === '"') {
      if (!inString) {
        // Starting a new string
        inString = true;
        result += char;
      } else {
        // We're inside a string - determine if this is the closing quote or an embedded quote
        // Look ahead past any whitespace to find the next meaningful character
        let lookaheadPos = i + 1;
        while (
          lookaheadPos < repaired.length &&
          /\s/.test(repaired[lookaheadPos])
        ) {
          lookaheadPos++;
        }
        const nextMeaningfulChar =
          lookaheadPos < repaired.length ? repaired[lookaheadPos] : "";

        // A closing quote should be followed (possibly with whitespace) by: , : } ] or end
        const isClosingQuote =
          nextMeaningfulChar === "," ||
          nextMeaningfulChar === ":" ||
          nextMeaningfulChar === "}" ||
          nextMeaningfulChar === "]" ||
          nextMeaningfulChar === "";

        if (isClosingQuote) {
          // This is the string delimiter - close the string
          inString = false;
          result += char;
        } else {
          // This quote is inside the string content - escape it
          result += "\\" + char;
        }
      }
    } else {
      result += char;
    }
  }

  return result;
}

function parseJsonWithContext<T>(jsonString: string, context: string): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    // Try to repair common JSON issues
    try {
      const repaired = attemptJsonRepair(jsonString);
      return JSON.parse(repaired) as T;
    } catch (repairError) {
      // Repair failed, provide detailed error context from the ORIGINAL error
      const errorMsg = error instanceof Error ? error.message : String(error);
      const match = errorMsg.match(/position (\d+)/);

      if (match) {
        const position = parseInt(match[1], 10);
        const start = Math.max(0, position - 100);
        const end = Math.min(jsonString.length, position + 100);
        const snippet = jsonString.substring(start, end);
        const pointer = " ".repeat(Math.min(position - start, 100)) + "^";

        // Also show a sample of the repaired JSON to help debug
        const repairedSnippet =
          repairError instanceof Error
            ? `\nRepair attempt also failed: ${repairError.message}`
            : "";

        throw new Error(
          `${context} - JSON parsing failed: ${errorMsg}\n\n` +
            `Snippet near error:\n${snippet}\n${pointer}${repairedSnippet}\n\n` +
            `This is likely an AI response formatting issue. Please retry the evaluation.`,
        );
      }

      throw new Error(
        `${context} - JSON parsing failed: ${errorMsg}\n` +
          `This is likely an AI response formatting issue. Please retry the evaluation.`,
      );
    }
  }
}


async function generateWithRetry<T>(
  passNumber: number,
  systemPrompt: string,
  userPrompt: string,
  validator: (output: T) => { valid: boolean; issues: string[] },
  parseContext: string,
  options: {
    allowedProviders?: AIProvider[];
    preferredProvider?: AIProvider;
  } = {}
): Promise<{ data: T; provider: AIProvider }> {
  let result = await generateWithFallback(systemPrompt, userPrompt, options);
  let cleaned = cleanJsonResponse(result.content);
  let parsed = parseJsonWithContext<T>(cleaned, parseContext);
  let validation = validator(parsed);

  if (validation.valid) {
    return { data: parsed, provider: result.provider };
  }

  console.warn(`Pass ${passNumber} validation failed, retrying...`);

  const enhancedPrompt = userPrompt + `

IMPORTANT: Previous response had quality issues. Please retry with:
1. Specific file:line references
2. Concrete code examples
3. Actionable advice
4. NO generic phrases`;

  result = await generateWithFallback(systemPrompt, enhancedPrompt, options);
  cleaned = cleanJsonResponse(result.content);
  parsed = parseJsonWithContext<T>(cleaned, parseContext + " (retry)");

  return { data: parsed, provider: result.provider };
}

export async function runEvaluation(
  input: EvaluationInput,
): Promise<EvaluationResult> {
  const processedSourceCode = prepareSourceCode(input.sourceCode);
  console.log(`Source: ${input.sourceCode.length} → ${processedSourceCode.length} chars`);

  // Pass 1: Structure Scan
  const pass1Result = await generateWithRetry<Pass1Output>(
    1,
    SYSTEM_PROMPT,
    buildPass1Prompt(processedSourceCode),
    validatePass1,
    "Pass 1 (Structure Scan)",
    { preferredProvider: "claude" }
  );
  const pass1 = pass1Result.data;
  console.log("Pass 1 done with " + pass1Result.provider);

  // Pass 2: Requirement Review
  const pass2Result = await generateWithRetry<Pass2Output>(
    2,
    SYSTEM_PROMPT,
    buildPass2Prompt(
      processedSourceCode,
      input.requirementTemplate,
      JSON.stringify(pass1, null, 2)
    ),
    validatePass2,
    "Pass 2 (Requirement Review)",
    { preferredProvider: "claude" }
  );
  const pass2 = pass2Result.data;
  console.log("Pass 2 done with " + pass2Result.provider);

  pass2.requirements = pass2.requirements.map((req) => ({
    ...req,
    status: normalizeStatus(req.status),
    positives: req.positives || [],
    improvements: req.improvements || [],
    evidence: req.evidence || [],
  }));

  // Pass 3: Final Scoring (Claude ONLY)
  const pass3RawResult = await generateWithFallback(
    SYSTEM_PROMPT,
    buildPass3Prompt(
      JSON.stringify(pass1, null, 2),
      JSON.stringify(pass2, null, 2),
      input.resultTemplate
    ),
    { allowedProviders: ["claude"] }
  );
  console.log("Pass 3 done with " + pass3RawResult.provider);
  const pass3Raw = pass3RawResult.content;

  // Split markdown and JSON
  const delimiter = "---JSON_DATA---";
  const delimiterIndex = pass3Raw.indexOf(delimiter);

  let markdownReport: string;
  let pass3Json: Omit<Pass3Output, "markdownReport">;

  if (delimiterIndex !== -1) {
    markdownReport = pass3Raw.substring(0, delimiterIndex).trim();
    const jsonPart = pass3Raw
      .substring(delimiterIndex + delimiter.length)
      .trim();
    const pass3Cleaned = cleanJsonResponse(jsonPart);
    pass3Json = parseJsonWithContext<Omit<Pass3Output, "markdownReport">>(
      pass3Cleaned,
      "Pass 3 (Final Scoring)",
    );
  } else {
    // Fallback: try to find JSON at the end
    const lastBrace = pass3Raw.lastIndexOf("}");
    const firstBrace = pass3Raw.lastIndexOf(
      "{",
      pass3Raw.lastIndexOf('"sectionScores"'),
    );
    if (firstBrace !== -1 && lastBrace !== -1) {
      markdownReport = pass3Raw.substring(0, firstBrace).trim();
      const fallbackJson = pass3Raw.substring(firstBrace, lastBrace + 1);
      pass3Json = parseJsonWithContext<Omit<Pass3Output, "markdownReport">>(
        fallbackJson,
        "Pass 3 (Final Scoring - Fallback)",
      );
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

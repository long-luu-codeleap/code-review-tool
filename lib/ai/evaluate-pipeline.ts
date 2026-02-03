import { generateContent } from "@/lib/ai/gemini-client";
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

function normalizeStatus(status: string): "pass" | "partial" | "fail" {
  // Normalize status values from AI responses to expected values
  const normalized = (status || "fail").toLowerCase().trim();

  if (
    normalized === "pass" ||
    normalized === "passed" ||
    normalized === "passing"
  ) {
    return "pass";
  }
  if (
    normalized === "partial" ||
    normalized === "partially" ||
    normalized === "partial pass"
  ) {
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

  let repaired = jsonString;

  // Step 1: Fix unescaped backslashes in Windows paths
  // Convert single backslashes to double backslashes (except for valid JSON escape sequences)
  // Valid sequences: \" \\ \/ \b \f \n \r \t \u (hence the regex: bfnrtu)
  repaired = repaired.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

  // Step 2: Fix unquoted property names (common AI response issue)
  // Match property names that are not quoted and quote them
  repaired = repaired.replace(
    /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g,
    '$1"$2":',
  );

  // Step 3: Fix missing commas between array elements and object properties
  // Add comma between } and { (objects in array)
  repaired = repaired.replace(/}\s*{/g, "},{");
  // Add comma between ] and [ (arrays in array)
  repaired = repaired.replace(/]\s*\[/g, "],[");
  // Add comma between string/number and { (mixed array elements)
  repaired = repaired.replace(/(["\d])\s*{/g, "$1,{");
  // Add comma between } and string/number (mixed array elements)
  repaired = repaired.replace(/}\s*(["\d])/g, "},$1");

  // Step 4: Fix trailing commas
  repaired = repaired.replace(/,\s*([}\]])/g, "$1");

  // Step 5: Fix mixed content that might have leaked into JSON
  // Remove any non-JSON content before the first { or [
  const firstJsonChar = repaired.search(/[{\[]/);
  if (firstJsonChar > 0) {
    repaired = repaired.substring(firstJsonChar);
  }

  // Step 6: Fix mixed quote styles - replace backticks and single quotes with escaped doubles
  // This handles cases like: `API_CONFIG` or 'sub_id' within string values
  // Do this BEFORE the quote escaping logic to normalize all quote types
  repaired = repaired.replace(/`([^`]+)`/g, '\\"$1\\"'); // `text` -> \"text\"

  // Step 7: Fix unescaped quotes within string values using a state machine
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

    // Handle single quotes within strings (convert to escaped doubles)
    if (char === "'") {
      if (inString) {
        // Single quote inside a string - convert to escaped double quote
        result += '\\"';
      } else {
        // Single quote as delimiter (shouldn't happen in valid JSON, but handle it)
        result += '"';
        inString = true;
      }
      continue;
    }

    // Handle double quotes
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

export async function runEvaluation(
  input: EvaluationInput,
): Promise<EvaluationResult> {
  // Pass 1: Structure Scan
  const pass1Raw = await generateContent(
    SYSTEM_PROMPT,
    buildPass1Prompt(input.sourceCode),
  );
  const pass1Cleaned = cleanJsonResponse(pass1Raw);
  const pass1 = parseJsonWithContext<Pass1Output>(
    pass1Cleaned,
    "Pass 1 (Structure Scan)",
  );

  // Pass 2: Requirement Review
  const pass2Raw = await generateContent(
    SYSTEM_PROMPT,
    buildPass2Prompt(
      input.sourceCode,
      input.requirementTemplate,
      JSON.stringify(pass1, null, 2),
    ),
  );
  const pass2Cleaned = cleanJsonResponse(pass2Raw);
  const pass2 = parseJsonWithContext<Pass2Output>(
    pass2Cleaned,
    "Pass 2 (Requirement Review)",
  );

  // Validate and normalize Pass 2 data
  pass2.requirements = pass2.requirements.map((req) => ({
    ...req,
    // Normalize status to one of the expected values
    status: normalizeStatus(req.status),
    // Ensure arrays are defined
    positives: req.positives || [],
    improvements: req.improvements || [],
    evidence: req.evidence || [],
  }));

  // Pass 3: Final Scoring
  const pass3Raw = await generateContent(
    SYSTEM_PROMPT,
    buildPass3Prompt(
      JSON.stringify(pass1, null, 2),
      JSON.stringify(pass2, null, 2),
      input.resultTemplate,
    ),
  );

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

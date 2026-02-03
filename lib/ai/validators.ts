import type { Pass2Output, RequirementScore } from "@/lib/types";

export interface ValidationResult {
  valid: boolean;
  issues: string[];
}

// Generic phrases that indicate low-quality feedback
const GENERIC_PHRASES = [
  /could be better/i,
  /needs improvement(?!\s+(?:in|to|by))/i, // Allow "needs improvement in X"
  /consider refactoring(?!\s+\w+)/i, // Allow "consider refactoring UserService"
  /add more tests(?!\s+for)/i, // Allow "add more tests for X"
  /improve code quality(?!\s+by)/i, // Must say HOW
  /needs work/i,
  /not ideal/i,
  /should be enhanced/i,
];

function hasGenericPhrases(text: string): boolean {
  return GENERIC_PHRASES.some((pattern) => pattern.test(text));
}

function hasCodeReference(text: string): boolean {
  // Check for file:line pattern (e.g., "app.tsx:45")
  return /\w+\.\w+:\d+/.test(text);
}

export function validatePass2(response: Pass2Output): ValidationResult {
  const issues: string[] = [];

  for (const req of response.requirements) {
    const reqName = req.requirement.substring(0, 50);

    // Check 1: No generic feedback in improvements
    for (const improvement of req.improvements || []) {
      if (hasGenericPhrases(improvement)) {
        issues.push(`Generic advice in "${reqName}": "${improvement}"`);
      }
    }

    // Check 2: Sufficient evidence
    if (!req.evidence || req.evidence.length < 2) {
      issues.push(`Insufficient evidence for "${reqName}"`);
    }

    // Check 3: Actionable improvements (min length 30 chars)
    const vagueImprovements = (req.improvements || []).filter(
      (i) => i.length < 30
    );
    if (vagueImprovements.length > 0) {
      issues.push(
        `Vague improvements in "${reqName}": ${vagueImprovements.length} too short`
      );
    }

    // Check 4: Has code references in evidence
    const hasRefs = (req.evidence || []).some(hasCodeReference);
    if (!hasRefs) {
      issues.push(`No file:line references for "${reqName}"`);
    }

    // Check 5: Minimum item counts
    if ((req.positives || []).length < 2) {
      issues.push(`Too few positives for "${reqName}"`);
    }
    if ((req.improvements || []).length < 2) {
      issues.push(`Too few improvements for "${reqName}"`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// Placeholder validators for other passes (can enhance later)
export function validatePass1(response: any): ValidationResult {
  return { valid: true, issues: [] };
}

export function validatePass3(response: any): ValidationResult {
  return { valid: true, issues: [] };
}

export const SYSTEM_PROMPT = `You are a senior frontend engineer with 10+ years of experience reviewing code assignments for hiring decisions. You provide thorough, fair, and constructive evaluations. You assess code quality, architecture, best practices, and completeness. You always support your assessments with specific evidence from the code.

IMPORTANT: When asked to return JSON, return ONLY valid JSON with no markdown formatting, no code fences, and no additional text. The response must be parseable by JSON.parse().`;

export function buildPass1Prompt(sourceCode: string): string {
  return `Analyze the structure and quality of this code submission. Review the following aspects and provide a score from 1-10 for each, along with specific evidence from the code.

Return a JSON object with this exact structure:
{
  "projectSetup": { "assessment": "string", "score": number, "evidence": ["string"] },
  "fileOrganization": { "assessment": "string", "score": number, "evidence": ["string"] },
  "architecturePatterns": { "assessment": "string", "score": number, "evidence": ["string"] },
  "codeQualitySignals": { "assessment": "string", "score": number, "evidence": ["string"] },
  "testingSetup": { "assessment": "string", "score": number, "evidence": ["string"] },
  "documentation": { "assessment": "string", "score": number, "evidence": ["string"] }
}

SOURCE CODE:
${sourceCode}`;
}

export function buildPass2Prompt(
  sourceCode: string,
  requirements: string,
  pass1Summary: string
): string {
  return `Based on the requirement template and the structural analysis from Pass 1, evaluate how well this submission meets each requirement.

For each requirement, provide:
- status: "pass", "partial", or "fail"
- score: 1-10
- positives: what was done well
- improvements: what could be better
- evidence: specific code references

Return a JSON object with this exact structure:
{
  "requirements": [
    {
      "requirement": "string - the requirement text",
      "status": "pass" | "partial" | "fail",
      "score": number,
      "positives": ["string"],
      "improvements": ["string"],
      "evidence": ["string"]
    }
  ]
}

REQUIREMENTS:
${requirements}

PASS 1 ANALYSIS:
${pass1Summary}

SOURCE CODE:
${sourceCode}`;
}

export function buildPass3Prompt(
  pass1: string,
  pass2: string,
  resultTemplate: string
): string {
  return `Generate a final evaluation report based on the structural analysis (Pass 1) and requirement review (Pass 2).

Your response must have TWO sections separated by the delimiter "---JSON_DATA---":

1. FIRST: A markdown report following the result template format below. Be specific, constructive, and fair. Include concrete examples from the code.

2. THEN the delimiter: ---JSON_DATA---

3. THEN: A JSON object with this exact structure (no code fences):
{
  "overallScore": number (1-10, one decimal),
  "candidateLevel": "Junior" | "Mid" | "Senior",
  "recommendation": "Proceed" | "Consider" | "Reject",
  "keyTakeaways": ["string - mix of strengths and areas for improvement"],
  "sectionScores": [
    { "name": "string", "score": number, "maxScore": 10 }
  ]
}

The sectionScores should include: "Project Structure", "Feature Completeness", "Code Quality", "Technical Proficiency", "Documentation & Testing".

RESULT TEMPLATE:
${resultTemplate}

PASS 1 ANALYSIS:
${pass1}

PASS 2 REQUIREMENT REVIEW:
${pass2}`;
}

export const SYSTEM_PROMPT = `You are a senior frontend engineer with 10+ years of experience reviewing React/TypeScript code assignments for hiring decisions at your company. You provide thorough, fair, and constructive evaluations.

Your evaluation philosophy:
- Focus on practical engineering skills and decision-making ability
- Assess code quality, architecture patterns, and best practices
- Value working, well-structured code over clever but fragile solutions
- Recognize good engineering trade-offs (e.g., choosing simplicity over premature optimization)
- Always support your assessments with specific evidence from the code
- Be fair but honest - identify both strengths and genuine areas for improvement

IMPORTANT: When asked to return JSON, return ONLY valid JSON with no markdown formatting, no code fences, and no additional text. The response must be parseable by JSON.parse().

JSON FORMATTING RULES:
- Always escape special characters in strings: backslashes (\\), quotes (\"), newlines (\\n)
- File paths must use forward slashes or escaped backslashes: "src/components/App.tsx" or "C:\\\\Users\\\\..."
- Never include unescaped quotes within string values
- Use double quotes for all JSON keys and string values, never single quotes`;

export function buildPass1Prompt(sourceCode: string): string {
  return `Analyze the structure and quality of this code submission. Review the following aspects and provide a score from 1-10 for each, along with specific evidence from the code.

Scoring guide:
- 9-10: Exceptional - Production-ready, follows best practices, well-architected
- 7-8: Strong - Solid implementation, minor improvements possible
- 5-6: Adequate - Works but has notable issues or missing best practices
- 3-4: Needs Work - Significant issues in structure or quality
- 1-2: Poor - Fundamental problems or incomplete implementation

Focus on:
- Project Setup: Build config, dependencies, TypeScript setup, environment handling
- File Organization: Folder structure, separation of concerns, component organization
- Architecture Patterns: Component structure, state management, data flow, routing
- Code Quality: Naming, consistency, React best practices, proper hooks usage
- Testing Setup: CRITICAL - Thoroughly review ALL test files and test cases:
  * Identify every test file (*.test.*, *.spec.*, __tests__/*)
  * Count total number of test cases/suites
  * Analyze test coverage: unit tests, integration tests, E2E tests
  * Check test quality: Are tests testing behavior or implementation?
  * Review test scenarios: happy path, edge cases, error handling
  * Evaluate mocking strategy and test data quality
  * Note any missing test coverage areas
- Documentation: README, code comments, API documentation

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

Evaluation guidelines:
- "pass": Requirement fully implemented and working correctly
- "partial": Requirement partially implemented, has issues, or missing edge cases
- "fail": Requirement not implemented or fundamentally broken

For each requirement in the template, provide:
- status: "pass", "partial", or "fail"
- score: 1-10 (reflects implementation quality and completeness)
- positives: specific things done well (with code evidence)
- improvements: specific suggestions for improvement
- evidence: file paths, function names, line references

Parse the requirements carefully - they may be in different formats:
- User stories ("As a user, I want...")
- Technical requirements ("The application should...")
- Bullet points or numbered lists
- Nested sub-requirements

Group related sub-requirements together when appropriate (e.g., all "Main Page" features).

Return a JSON object with this exact structure:
{
  "requirements": [
    {
      "requirement": "string - the requirement text",
      "status": "pass" | "partial" | "fail",
      "score": number,
      "positives": ["string"],
      "improvements": ["string"],
      "evidence": ["string - specific code references"]
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

1. FIRST: A markdown report following the result template format below. Be specific, constructive, and professional. Guidelines:
   - Write in a balanced, fair tone
   - Support claims with concrete code examples
   - Recognize both strengths and areas for improvement
   - Provide actionable feedback the candidate can learn from
   - Structure your report according to the template sections
   - Be thorough but concise - quality over quantity
   - **CRITICAL for Testing section**: List ALL test files found, describe what each test file covers, analyze test scenarios comprehensively (happy path, edge cases, errors), and specify exact coverage gaps

2. THEN the delimiter: ---JSON_DATA---

3. THEN: A JSON object with this exact structure (no code fences):
{
  "overallScore": number (1-10, one decimal place),
  "candidateLevel": "Junior" | "Mid" | "Senior",
  "recommendation": "Proceed" | "Consider" | "Reject",
  "keyTakeaways": ["string - mix of strengths and areas for improvement, 4-6 items"],
  "sectionScores": [
    { "name": "string", "score": number, "maxScore": 10 }
  ]
}

Scoring and recommendation guidelines:
- Overall Score:
  * 8-10: Strong candidate, hire or strongly consider
  * 6-7: Adequate with reservations, consider for junior/mid roles
  * 4-5: Needs significant improvement
  * 1-3: Not meeting hiring bar

- Candidate Level assessment:
  * Junior: 1-2 years experience, learns well, needs mentorship on architecture
  * Mid: 3-5 years, solid fundamentals, makes good technical decisions
  * Senior: 5+ years, excellent architecture, considers edge cases, best practices

- Recommendation:
  * "Proceed": Strong candidate, move to interview
  * "Consider": Has potential but notable gaps, discuss as team
  * "Reject": Not meeting minimum requirements

The sectionScores should include: "Code Structure & Quality", "Required Features", "Testing", "Documentation".

RESULT TEMPLATE:
${resultTemplate}

PASS 1 ANALYSIS:
${pass1}

PASS 2 REQUIREMENT REVIEW:
${pass2}`;
}

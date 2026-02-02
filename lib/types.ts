export interface FileEntry {
  path: string;
  content: string;
}

export interface SourceData {
  sourceCode: string;
  fileTree: string[];
  repoInfo?: {
    owner: string;
    repo: string;
    branch: string;
  };
}

export interface EvaluationInput {
  sourceCode: string;
  fileTree: string[];
  requirementTemplate: string;
  resultTemplate: string;
}

export interface StructureAssessment {
  assessment: string;
  score: number;
  evidence: string[];
}

export interface Pass1Output {
  projectSetup: StructureAssessment;
  fileOrganization: StructureAssessment;
  architecturePatterns: StructureAssessment;
  codeQualitySignals: StructureAssessment;
  testingSetup: StructureAssessment;
  documentation: StructureAssessment;
}

export interface RequirementScore {
  requirement: string;
  status: "pass" | "partial" | "fail";
  score: number;
  positives: string[];
  improvements: string[];
  evidence: string[];
}

export interface Pass2Output {
  requirements: RequirementScore[];
}

export interface SectionScore {
  name: string;
  score: number;
  maxScore: number;
}

export interface Pass3Output {
  overallScore: number;
  candidateLevel: string;
  recommendation: "Proceed" | "Consider" | "Reject";
  keyTakeaways: string[];
  sectionScores: SectionScore[];
  markdownReport: string;
}

export interface EvaluationResult {
  pass1: Pass1Output;
  pass2: Pass2Output;
  pass3: Pass3Output;
}

export type EvaluationPass = 1 | 2 | 3;

export interface EvaluationState {
  sourceData: SourceData | null;
  requirementTemplate: string;
  resultTemplate: string;
  currentPass: EvaluationPass | null;
  isLoading: boolean;
  error: string | null;
  result: EvaluationResult | null;
}

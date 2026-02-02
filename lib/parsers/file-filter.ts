import { IGNORED_PATTERNS, IGNORED_EXTENSIONS } from "@/lib/constants";

export function shouldIncludeFile(filePath: string): boolean {
  const parts = filePath.split("/");

  for (const part of parts) {
    if (IGNORED_PATTERNS.includes(part)) {
      return false;
    }
  }

  const lower = filePath.toLowerCase();
  for (const ext of IGNORED_EXTENSIONS) {
    if (lower.endsWith(ext)) {
      return false;
    }
  }

  return true;
}

export function formatSourceCode(
  files: { path: string; content: string }[]
): string {
  return files
    .map((f) => `--- File: ${f.path} ---\n\n${f.content}`)
    .join("\n\n");
}

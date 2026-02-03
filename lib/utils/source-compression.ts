export function compressSourceCode(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(?<!:)\/\/.*/g, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function smartTruncate(fileContent: string, maxLines: number = 600): string {
  const lines = fileContent.split("\n");
  if (lines.length <= maxLines) return fileContent;

  const sectionSize = Math.floor(maxLines / 3);
  const top = lines.slice(0, sectionSize);
  const middle = lines.slice(Math.floor(lines.length / 2) - Math.floor(sectionSize / 2), Math.floor(lines.length / 2) + Math.floor(sectionSize / 2));
  const bottom = lines.slice(-sectionSize);
  const omittedCount = lines.length - maxLines;

  return [...top, "", `// ... ${omittedCount} lines omitted ...`, "", ...middle, "", "// ... continuing ...", "", ...bottom].join("\n");
}

export function prepareSourceCode(sourceCode: string): string {
  let processed = compressSourceCode(sourceCode);
  const lines = processed.split("\n");
  if (lines.length > 1000) {
    processed = smartTruncate(processed, 800);
  }
  return processed;
}

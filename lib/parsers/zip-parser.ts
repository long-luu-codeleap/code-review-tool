import JSZip from "jszip";
import { shouldIncludeFile, formatSourceCode } from "./file-filter";
import type { SourceData } from "@/lib/types";

export async function parseZipFile(file: File): Promise<SourceData> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const files: { path: string; content: string }[] = [];
  const fileTree: string[] = [];

  const entries = Object.entries(zip.files);

  // Find common prefix (top-level folder in zip)
  let commonPrefix = "";
  const paths = entries
    .filter(([, f]) => !f.dir)
    .map(([p]) => p);

  if (paths.length > 0) {
    const firstSlash = paths[0].indexOf("/");
    if (firstSlash !== -1) {
      const candidate = paths[0].substring(0, firstSlash + 1);
      if (paths.every((p) => p.startsWith(candidate))) {
        commonPrefix = candidate;
      }
    }
  }

  for (const [path, zipEntry] of entries) {
    if (zipEntry.dir) continue;

    const relativePath = commonPrefix
      ? path.substring(commonPrefix.length)
      : path;

    if (!relativePath) continue;

    fileTree.push(relativePath);

    if (!shouldIncludeFile(relativePath)) continue;

    try {
      const content = await zipEntry.async("string");
      files.push({ path: relativePath, content });
    } catch {
      // Skip binary files that can't be read as string
    }
  }

  return {
    sourceCode: formatSourceCode(files),
    fileTree: fileTree.sort(),
  };
}

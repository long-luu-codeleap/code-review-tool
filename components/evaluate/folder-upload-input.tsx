"use client";

import { useState } from "react";
import {
  FolderOpen,
  Loader2,
  CheckCircle2,
  FileText,
  RefreshCw,
} from "lucide-react";
import { shouldIncludeFile, formatSourceCode } from "@/lib/parsers/file-filter";
import { Button } from "@/components/ui/button";
import type { SourceData } from "@/lib/types";

interface FolderUploadInputProps {
  sourceData: SourceData | null;
  onSourceLoaded: (data: SourceData) => void;
  onError: (error: string) => void;
}

export function FolderUploadInput({
  sourceData,
  onSourceLoaded,
  onError,
}: FolderUploadInputProps) {
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setLoading(true);
    try {
      const files: { path: string; content: string }[] = [];
      const fileTree: string[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const path = file.webkitRelativePath || file.name;

        // Remove the top-level folder name
        const parts = path.split("/");
        const relativePath = parts.length > 1 ? parts.slice(1).join("/") : path;

        fileTree.push(relativePath);

        if (!shouldIncludeFile(relativePath)) continue;

        try {
          const content = await file.text();
          // Skip binary files
          if (!content.includes("\0")) {
            files.push({ path: relativePath, content });
          }
        } catch {
          // Skip unreadable files
        }
      }

      if (files.length === 0) {
        onError("No readable source files found in the folder");
        return;
      }

      onSourceLoaded({
        sourceCode: formatSourceCode(files),
        fileTree: fileTree.sort(),
        loadMethod: "folder",
      });
    } catch {
      onError("Failed to read folder contents");
    } finally {
      setLoading(false);
    }
  }

  // Show success state if files are loaded via this method (folder)
  if (sourceData && sourceData.loadMethod === "folder" && !loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center rounded-lg border-2 border-green-500/50 bg-green-500/10 p-6 text-center">
          <div className="space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-700">
                {sourceData.fileTree.length} files loaded successfully!
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {sourceData.repoInfo
                  ? `From ${sourceData.repoInfo.owner}/${sourceData.repoInfo.repo}`
                  : "Ready for evaluation"}
              </p>
            </div>
            <label>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-3 w-3" />
                Change Folder
              </Button>
              <input
                type="file"
                className="hidden"
                onChange={handleChange}
                {...({
                  webkitdirectory: "",
                  directory: "",
                } as React.InputHTMLAttributes<HTMLInputElement>)}
              />
            </label>
          </div>
        </div>

        {/* Show file tree preview */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4" />
            File Tree Preview ({Math.min(
              10,
              sourceData.fileTree.length,
            )} of {sourceData.fileTree.length})
          </div>
          <div className="max-h-40 overflow-y-auto rounded bg-background p-2 font-mono text-xs">
            {sourceData.fileTree.slice(0, 10).map((file, i) => (
              <div key={i} className="py-0.5 text-muted-foreground">
                {file}
              </div>
            ))}
            {sourceData.fileTree.length > 10 && (
              <div className="py-0.5 text-xs italic text-muted-foreground">
                ... and {sourceData.fileTree.length - 10} more files
              </div>
            )}
          </div>
        </div>

        {/* Next steps hint */}
        <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-3">
          <p className="text-xs text-blue-700">
            <strong>Next step:</strong> Review the templates below, then scroll
            down and click &quot;Evaluate&quot; to start the AI evaluation.
          </p>
        </div>
      </div>
    );
  }

  // Show upload UI
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center hover:border-muted-foreground/50">
      {loading ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
        </>
      ) : (
        <>
          <FolderOpen className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">Select a project folder</p>
          <p className="mb-3 text-xs text-muted-foreground">
            All source files will be read from the folder
          </p>
          <label className="cursor-pointer rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80">
            Choose Folder
            <input
              type="file"
              className="hidden"
              onChange={handleChange}
              {...({
                webkitdirectory: "",
                directory: "",
              } as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          </label>
        </>
      )}
    </div>
  );
}

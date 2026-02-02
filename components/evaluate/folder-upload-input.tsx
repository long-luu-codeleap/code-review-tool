"use client";

import { useState } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
import { shouldIncludeFile, formatSourceCode } from "@/lib/parsers/file-filter";
import type { SourceData } from "@/lib/types";

interface FolderUploadInputProps {
  onSourceLoaded: (data: SourceData) => void;
  onError: (error: string) => void;
}

export function FolderUploadInput({
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
      });
    } catch {
      onError("Failed to read folder contents");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center hover:border-muted-foreground/50">
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
              {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          </label>
        </>
      )}
    </div>
  );
}

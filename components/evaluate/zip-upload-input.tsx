"use client";

import { useState, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import { parseZipFile } from "@/lib/parsers/zip-parser";
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from "@/lib/constants";
import type { SourceData } from "@/lib/types";

interface ZipUploadInputProps {
  onSourceLoaded: (data: SourceData) => void;
  onError: (error: string) => void;
}

export function ZipUploadInput({ onSourceLoaded, onError }: ZipUploadInputProps) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".zip")) {
        onError("Please upload a .zip file");
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        onError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }
      setLoading(true);
      try {
        const data = await parseZipFile(file);
        onSourceLoaded(data);
      } catch {
        onError("Failed to parse ZIP file. Make sure it's a valid archive.");
      } finally {
        setLoading(false);
      }
    },
    [onSourceLoaded, onError]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        dragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
    >
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      ) : (
        <>
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">
            Drag & drop a ZIP file here
          </p>
          <p className="mb-3 text-xs text-muted-foreground">
            or click to browse (max {MAX_FILE_SIZE_MB}MB)
          </p>
          <label className="cursor-pointer rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80">
            Browse Files
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleChange}
            />
          </label>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Loader2,
  Github,
  CheckCircle2,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SourceData } from "@/lib/types";

interface GitHubUrlInputProps {
  sourceData: SourceData | null;
  onSourceLoaded: (data: SourceData) => void;
  onError: (error: string) => void;
}

export function GitHubUrlInput({
  sourceData,
  onSourceLoaded,
  onError,
}: GitHubUrlInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(!sourceData);

  async function handleFetch() {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Failed to fetch repository");
        return;
      }
      onSourceLoaded({ ...data, loadMethod: "github" });
    } catch {
      onError("Failed to fetch repository. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Show success state if files are loaded via this method (github)
  if (sourceData && sourceData.loadMethod === "github" && !showInput) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center rounded-lg border-2 border-green-500/50 bg-green-500/10 p-6 text-center">
          <div className="space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-700">
                {sourceData.fileTree.length} files loaded successfully!
              </p>
              {sourceData.repoInfo && (
                <p className="mt-1 text-xs text-muted-foreground">
                  From {sourceData.repoInfo.owner}/{sourceData.repoInfo.repo}
                  {sourceData.repoInfo.branch &&
                    ` (${sourceData.repoInfo.branch})`}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setUrl("");
                setShowInput(true);
              }}
            >
              <RefreshCw className="h-3 w-3" />
              Change Repository
            </Button>
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

  // Show input UI
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="https://github.com/user/repo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-9"
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
        />
      </div>
      <Button
        onClick={handleFetch}
        disabled={loading || !url.trim()}
        className="cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fetching...
          </>
        ) : (
          "Fetch"
        )}
      </Button>
    </div>
  );
}

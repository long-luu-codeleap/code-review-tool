"use client";

import { useState } from "react";
import { Loader2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SourceData } from "@/lib/types";

interface GitHubUrlInputProps {
  onSourceLoaded: (data: SourceData) => void;
  onError: (error: string) => void;
}

export function GitHubUrlInput({ onSourceLoaded, onError }: GitHubUrlInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
      onSourceLoaded(data);
    } catch {
      onError("Failed to fetch repository. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

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
      <Button onClick={handleFetch} disabled={loading || !url.trim()}>
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

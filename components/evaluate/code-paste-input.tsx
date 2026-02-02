"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { SourceData } from "@/lib/types";

interface CodePasteInputProps {
  onSourceLoaded: (data: SourceData) => void;
  onError: (error: string) => void;
}

export function CodePasteInput({ onSourceLoaded, onError }: CodePasteInputProps) {
  const [code, setCode] = useState("");

  function handleLoad() {
    const trimmed = code.trim();
    if (!trimmed) {
      onError("Please paste some code first");
      return;
    }
    onSourceLoaded({
      sourceCode: trimmed,
      fileTree: ["(pasted code)"],
    });
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Paste the candidate's source code here...

You can paste a single file or multiple files. For multiple files, use this format:

--- File: src/App.tsx ---

import React from 'react';
..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="min-h-[200px] font-mono text-sm"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {code.length.toLocaleString()} characters
        </span>
        <Button onClick={handleLoad} disabled={!code.trim()} size="sm">
          Load Code
        </Button>
      </div>
    </div>
  );
}

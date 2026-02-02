"use client";

import { Copy, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { EvaluationResult } from "@/lib/types";

interface ExportToolbarProps {
  result: EvaluationResult;
}

export function ExportToolbar({ result }: ExportToolbarProps) {
  function handleCopy() {
    const text = result.pass3.markdownReport;
    navigator.clipboard.writeText(text).then(
      () => toast.success("Report copied to clipboard"),
      () => toast.error("Failed to copy to clipboard")
    );
  }

  function handleDownloadMarkdown() {
    const blob = new Blob([result.pass3.markdownReport], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evaluation-report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
        <Copy className="h-4 w-4" />
        Copy
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadMarkdown}
        className="gap-1"
      >
        <Download className="h-4 w-4" />
        Markdown
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
        <Printer className="h-4 w-4" />
        Print PDF
      </Button>
    </div>
  );
}

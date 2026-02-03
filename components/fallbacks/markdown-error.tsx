import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FallbackProps } from "react-error-boundary";

export function MarkdownErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileX className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg">Detailed Report</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Failed to render markdown report:{" "}
          {error instanceof Error ? error.message : String(error)}
        </p>
        <p className="text-xs text-muted-foreground">
          This usually happens when the markdown content contains invalid syntax
          or unsupported elements.
        </p>
        <Button onClick={resetErrorBoundary} size="sm" variant="outline">
          Retry Rendering
        </Button>
      </CardContent>
    </Card>
  );
}

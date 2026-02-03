import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FallbackProps } from "react-error-boundary";

export function RequirementErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            Failed to load requirement
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Error: {error instanceof Error ? error.message : String(error)}
        </p>
        <p className="text-xs text-muted-foreground">
          The requirement data may be malformed or missing required fields.
        </p>
        <Button
          onClick={resetErrorBoundary}
          size="sm"
          variant="ghost"
          className="h-8"
        >
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[600px] items-center justify-center p-4">
      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Application Error</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred. This might be due to invalid data or a
            temporary issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-mono text-muted-foreground">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={reset}>Try Again</Button>
            <Button
              variant="outline"
              onClick={() => {
                sessionStorage.clear();
                window.location.href = "/evaluate";
              }}
            >
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

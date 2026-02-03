"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HelpCircle, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="no-print sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border/50 dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link
            href="/evaluate"
            className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.svg"
              alt="CodeLeap Logo"
              width={200}
              height={40}
              priority
              className="h-auto w-37.5 transition-all dark:invert dark:drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            />
          </Link>
          <nav className="ml-8 flex items-center gap-4 text-sm">
            <Link
              href="/evaluate"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              Evaluate
            </Link>
            <span className="cursor-not-allowed text-muted-foreground">
              History
            </span>
            <span className="cursor-not-allowed text-muted-foreground">
              Dashboard
            </span>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 cursor-pointer hover:scale-110 transition-transform animate-pulse"
              onClick={() => setShowHelp(true)}
              title="How to use"
            >
              <HelpCircle className="h-4 w-4 animate-bounce" />
              <span className="sr-only">Help</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 cursor-pointer"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 cursor-pointer"
              onClick={() => setShowHelp(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <h2 className="mb-4 text-xl font-semibold">
              How to Use CodeLeap Evaluator
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="mb-2 font-medium text-primary">
                  Step 1: Load the Code
                </h3>
                <p className="text-muted-foreground">
                  Choose one of two options:
                </p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>
                    <strong>GitHub URL:</strong> Paste a repository link (e.g.,
                    github.com/username/repo) and click &quot;Fetch&quot;
                  </li>
                  <li>
                    <strong>Folder Upload:</strong> Click &quot;Folder&quot; tab
                    and select a local project folder
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-primary">
                  Step 2: Review Templates
                </h3>
                <p className="text-muted-foreground">
                  Click on the template cards to expand and customize:
                </p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>
                    <strong>Requirement Template:</strong> Define what skills
                    and features to evaluate
                  </li>
                  <li>
                    <strong>Result Template:</strong> Customize the report
                    format and sections
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-primary">
                  Step 3: Run Evaluation
                </h3>
                <p className="text-muted-foreground">
                  Click the &quot;Evaluate&quot; button. The AI will analyze the
                  code in 3 passes and generate a detailed report with scores,
                  recommendations, and actionable feedback.
                </p>
              </div>

              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                <h3 className="mb-1 font-medium text-amber-700 dark:text-amber-400">
                  💡 Tips for Best Results
                </h3>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>
                    Ensure GitHub repositories are public or shared with the
                    evaluator
                  </li>
                  <li>
                    Customize the requirement template to match your job posting
                  </li>
                  <li>The evaluation takes 1-2 minutes to complete</li>
                  <li>
                    Export results as PDF or Markdown for sharing with your team
                  </li>
                </ul>
              </div>
            </div>

            <Button
              className="mt-6 w-full cursor-pointer"
              onClick={() => setShowHelp(false)}
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        {/* AI Disclaimer */}
        <div className="mb-4 flex items-start gap-2 rounded-lg  border-amber-500/50 bg-amber-500/10 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="text-amber-800">
            <strong>AI-Powered Tool Disclaimer:</strong> This tool uses AI
            models (Groq Llama 3.3 70B / Google Gemini) which may produce
            inaccurate, incomplete, or biased results. Always review evaluations
            manually and use your professional judgment before making hiring
            decisions. AI evaluations are meant to assist, not replace, human
            review.
          </div>
        </div>

        {/* Copyright and Links */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-4">
            <span>© 2026 Long Luu</span>
            <span>•</span>
            <Link
              href="https://github.com/yourusername/code-eval"
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </div>
          <div className="text-center sm:text-right">
            Built with Next.js, React, Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
}

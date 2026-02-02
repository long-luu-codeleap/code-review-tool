"use client";

import Link from "next/link";
import Image from "next/image";

export function AppHeader() {
  return (
    <header className="no-print sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link
          href="/evaluate"
          className="flex items-center gap-2 font-semibold"
        >
          <Image src="/logo.svg" alt="CodeLeap Logo" width={200} height={200} />
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
      </div>
    </header>
  );
}

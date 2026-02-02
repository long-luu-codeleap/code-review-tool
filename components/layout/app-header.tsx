"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    <header className="no-print sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border/50 dark:shadow-lg">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link
          href="/evaluate"
          className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.svg"
            alt="CodeLeap Logo"
            width={200}
            height={200}
            className="dark:brightness-200 dark:contrast-125"
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
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b border-border-primary bg-background-secondary flex items-center justify-between px-6">
      <div className="text-sm text-text-muted">
        OpenQuant · QuantPad-style workflow
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary" size="sm">
          <Link href="/">Landing</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    </header>
  );
}


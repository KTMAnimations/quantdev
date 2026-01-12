import Link from "next/link";

import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/ideation", label: "Ideation" },
  { href: "/code", label: "Code" },
  { href: "/quant-copilot", label: "Quant Copilot" },
  { href: "/library", label: "Library" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-qp-bg-primary/80 backdrop-blur-md border-b border-qp-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-semibold text-qp-text-primary">
            OpenQuant
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-qp-text-secondary hover:text-qp-text-primary transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <Button asChild size="sm" className="bg-qp-violet hover:bg-qp-violet-dark">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </nav>
  );
}


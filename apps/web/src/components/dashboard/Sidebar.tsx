"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  FlaskConical,
  Library,
  Lightbulb,
  MessageSquare,
  Rocket,
  Settings2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/ideation", label: "Ideation", icon: Lightbulb },
  { href: "/code", label: "Code", icon: Code2 },
  { href: "/test", label: "Test", icon: FlaskConical },
  { href: "/optimize", label: "Optimize", icon: Settings2 },
  { href: "/deploy", label: "Deploy", icon: Rocket },
  { href: "/library", label: "Library", icon: Library },
  { href: "/copilot", label: "Copilot", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border-primary bg-background-secondary">
      <div className="h-16 flex items-center px-6 border-b border-border-primary">
        <Link href="/" className="font-semibold tracking-tight text-text-primary">
          OpenQuant
        </Link>
      </div>

      <nav className="p-3 space-y-1">
        {NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-background-tertiary text-text-primary"
                  : "text-text-secondary hover:bg-background-tertiary hover:text-text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


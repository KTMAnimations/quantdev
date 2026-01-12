import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent-primary)_10%,transparent),transparent_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-qp-bg-primary to-transparent" />

      <div className="text-center z-10 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-qp-text-primary mb-6 tracking-tight">
          Your AI <span className="text-qp-violet">Quant Dev</span>
        </h1>
        <p className="text-xl text-qp-text-secondary max-w-2xl mx-auto mb-10">
          Turn trading ideas into code, stats, and deployed systems in one
          seamless workflow.
        </p>

        <Button asChild size="lg" className="px-8 py-6 bg-qp-violet hover:bg-qp-violet-dark">
          <Link href="/sign-in">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

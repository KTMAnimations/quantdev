import {
  Bot,
  Brain,
  Bug,
  Code2,
  Library,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    title: "Machine Learning",
    description:
      "Multi-feature interactions, nonlinear pattern discovery, hidden-edge detection.",
    icon: Brain,
  },
  {
    title: "Advanced Strategy Coding",
    description:
      "Multi-confluence logic, stateful model support, full risk framework.",
    icon: Code2,
  },
  {
    title: "Influencer Strategy Library",
    description:
      "Bi-weekly releases, drop-in TradingView templates, community roadmap.",
    icon: Library,
  },
  {
    title: "Influencer Indicators Library",
    description: "Ready-made overlays, easy customization, built for discovery.",
    icon: Sparkles,
  },
  {
    title: "LLMs Built for Pine",
    description:
      "RAG over curated Pine corpus, deterministic tool use, higher compile success.",
    icon: Bot,
  },
  {
    title: "Pine Script Debugging",
    description:
      "Iterative compile fixes, fewer TradingView round-trips, faster workflow.",
    icon: Bug,
  },
];

export function FeatureGrid() {
  return (
    <section className="py-24 px-6 bg-qp-bg-primary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-qp-text-primary mb-3">
            Built for Quant Workflows
          </h2>
          <p className="text-qp-text-secondary">
            QuantPad-style tooling, recreated with open-source building blocks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.title}
                className="bg-qp-bg-secondary border-qp-border hover:border-qp-violet/50 transition-colors"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-qp-violet/15 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-qp-violet" />
                  </div>
                  <div className="text-lg font-semibold text-qp-text-primary">
                    {f.title}
                  </div>
                  <div className="text-sm text-qp-text-secondary leading-relaxed">
                    {f.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}


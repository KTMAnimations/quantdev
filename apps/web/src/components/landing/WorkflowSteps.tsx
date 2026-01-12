const STEPS = [
  {
    number: 1,
    title: "Discover",
    subtitle: "Measure the Edge in Any Idea",
    description:
      "Describe any feature in plain English, and instantly test whether it predicts market movement.",
    videoUrl: "/demos/ideation.mp4",
  },
  {
    number: 2,
    title: "Build",
    subtitle: "Strategies & Indicators",
    description:
      "Describe your strategy in natural language. We convert it into TradingView Pine, ready to test.",
    videoUrl: "/demos/build.mp4",
  },
  {
    number: 3,
    title: "Test",
    subtitle: "Validate With Institutional Math",
    description:
      "Run bootstrapping and Monte Carlo simulations to reveal whether performance is real or luck.",
    videoUrl: "/demos/test.mp4",
  },
  {
    number: 4,
    title: "Optimize",
    subtitle: "See What Truly Drives Performance",
    description:
      "Automatic feature computation, regression analysis, and factor discovery for your KPIs.",
    videoUrl: "/demos/optimize.mp4",
  },
  {
    number: 5,
    title: "Deploy",
    subtitle: "Launch or Simulate Prop Firm Performance",
    description:
      "Deploy live or simulate odds of passing major prop firm challenges with true expected value.",
    videoUrl: "/demos/deploy.mp4",
  },
];

export function WorkflowSteps() {
  return (
    <section className="py-24 px-6 bg-qp-bg-primary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-qp-text-primary mb-4">
          The QuantPad Workflow
        </h2>
        <p className="text-center text-qp-text-secondary mb-16">
          From idea to deployed strategy in clear, ordered steps.
        </p>

        <div className="space-y-24">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
            >
              <div className="flex-1 rounded-xl overflow-hidden border border-qp-border bg-qp-bg-secondary">
                <video
                  src={step.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/demos/placeholder.svg"
                  className="w-full"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 rounded-full bg-qp-violet/20 text-qp-violet flex items-center justify-center font-bold">
                    {step.number}
                  </span>
                  <span className="text-sm text-qp-text-muted">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-qp-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-qp-violet font-medium mb-4">
                  {step.subtitle}
                </p>
                <p className="text-qp-text-secondary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

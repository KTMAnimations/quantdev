import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Hero } from "@/components/landing/Hero";
import { WorkflowSteps } from "@/components/landing/WorkflowSteps";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkflowSteps />
      <FeatureGrid />
    </main>
  );
}


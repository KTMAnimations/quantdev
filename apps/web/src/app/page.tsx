import { Hero } from "@/components/landing/Hero";
import { WorkflowSteps } from "@/components/landing/WorkflowSteps";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary">
      <Hero />
      <WorkflowSteps />
    </main>
  );
}

import { IdeationForm } from "@/components/ideation/IdeationForm";

export default function IdeationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edge Discovery</h1>
        <p className="text-text-secondary">
          Describe a feature and measure predictive power.
        </p>
      </div>
      <IdeationForm />
    </div>
  );
}

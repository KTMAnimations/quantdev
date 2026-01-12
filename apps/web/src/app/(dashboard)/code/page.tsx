import { PineGenerateForm } from "@/components/pine/PineGenerateForm";

export default function CodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Pine Script Generator
        </h1>
        <p className="text-text-secondary">
          Turn natural language into Pine Script.
        </p>
      </div>
      <PineGenerateForm />
    </div>
  );
}

import { ChatInterface } from "@/components/ChatInterface";

export default function QuantCopilotPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quant Copilot</h1>
        <p className="text-text-secondary">
          Chat interface for workflow assistance.
        </p>
      </div>

      <ChatInterface />
    </div>
  );
}


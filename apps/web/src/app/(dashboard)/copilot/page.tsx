import { Card, CardContent } from "@/components/ui/card";

export default function CopilotPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Copilot</h1>
        <p className="text-text-secondary">
          Chat interface for workflow assistance.
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-text-secondary">
            Chat UI + LLM integration comes next.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


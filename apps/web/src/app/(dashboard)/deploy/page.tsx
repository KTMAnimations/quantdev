import { Card, CardContent } from "@/components/ui/card";

export default function DeployPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Prop Firm Simulator
        </h1>
        <p className="text-text-secondary">
          Simulate challenge pass/fail rates under constraints.
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-text-secondary">
            Simulator endpoint + UI comes next.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


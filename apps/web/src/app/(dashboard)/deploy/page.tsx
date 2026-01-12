import { PropFirmLab } from "@/components/deploy/PropFirmLab";

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

      <PropFirmLab />
    </div>
  );
}

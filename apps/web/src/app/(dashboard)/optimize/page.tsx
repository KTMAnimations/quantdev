import { RegressionLab } from "@/components/optimize/RegressionLab";

export default function OptimizePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Regression Analysis
        </h1>
        <p className="text-text-secondary">
          Identify drivers of returns, risk, and drawdown.
        </p>
      </div>

      <RegressionLab />
    </div>
  );
}

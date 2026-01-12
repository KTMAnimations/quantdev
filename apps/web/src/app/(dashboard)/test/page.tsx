import { Card, CardContent } from "@/components/ui/card";
import { TradingChart } from "@/components/charts/TradingChart";
import { EquityCurve } from "@/components/charts/EquityCurve";

const CANDLES = [
  { time: "2025-01-02", open: 100, high: 102, low: 99, close: 101 },
  { time: "2025-01-03", open: 101, high: 103, low: 100, close: 102 },
  { time: "2025-01-06", open: 102, high: 104, low: 101, close: 103 },
  { time: "2025-01-07", open: 103, high: 104, low: 100, close: 101 },
  { time: "2025-01-08", open: 101, high: 105, low: 101, close: 104 },
  { time: "2025-01-09", open: 104, high: 106, low: 103, close: 105 },
  { time: "2025-01-10", open: 105, high: 106, low: 102, close: 103 },
  { time: "2025-01-13", open: 103, high: 104, low: 100, close: 101 },
  { time: "2025-01-14", open: 101, high: 103, low: 99, close: 100 },
  { time: "2025-01-15", open: 100, high: 102, low: 98, close: 99 },
];

const EQUITY = [
  { t: "t0", equity: 10_000 },
  { t: "t1", equity: 10_120 },
  { t: "t2", equity: 10_050 },
  { t: "t3", equity: 10_300 },
  { t: "t4", equity: 10_220 },
  { t: "t5", equity: 10_480 },
  { t: "t6", equity: 10_410 },
];

export default function TestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Monte Carlo</h1>
        <p className="text-text-secondary">
          Stress-test backtest results with bootstrapping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-text-secondary">Sample Candles</div>
            <TradingChart data={CANDLES} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-text-secondary">Sample Equity Curve</div>
            <EquityCurve data={EQUITY} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

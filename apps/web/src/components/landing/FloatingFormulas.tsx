"use client";

const FORMULAS = [
  "S = (Rp - Rf) / σp",
  "σ = √(Σ(xi - μ)² / N)",
  "E[X] = Σ xi · P(xi)",
  "f* = (bp - q) / b",
  "MDD = (Peak - Trough) / Peak",
  "Sortino = (R - T) / DR",
  "β = Cov(ri, rm) / Var(rm)",
  "α = Ri - [Rf + β(Rm - Rf)]",
  "VaR = μ - zσ",
  "PF = ΣWins / Σ|Losses|",
  "CAGR = (Vf/Vi)^(1/t) - 1",
  "R² = 1 - (SSres/SStot)",
  "ρ = Cov(X,Y) / σxσy",
  "IR = (Rp - Rb) / σ(Rp - Rb)",
  "∫Σ∂∞μλ$%",
];

function hashToSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function FloatingFormulas() {
  const items = FORMULAS.map((formula, i) => {
    const rand = mulberry32(hashToSeed(`${i}:${formula}`));
    const pct = () => `${rand() * 100}%`;
    const duration = () => `${20 + rand() * 10}s`;

    return {
      id: i,
      formula,
      left: pct(),
      top: pct(),
      delay: `${i * 2}s`,
      duration: duration(),
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute text-qp-violet/10 text-sm md:text-base font-mono whitespace-nowrap animate-float"
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.formula}
        </div>
      ))}
    </div>
  );
}

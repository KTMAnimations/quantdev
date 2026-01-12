"use client";

import { motion } from "framer-motion";

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
];

type FormulaMotion = {
  id: number;
  formula: string;
  initial: { x: string; y: string; opacity: number };
  animate: {
    x: string[];
    y: string[];
    opacity: number[];
    rotate: number[];
  };
  transition: {
    duration: number;
    repeat: number;
    delay: number;
    ease: "linear";
  };
};

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
  const items: FormulaMotion[] = FORMULAS.map((formula, i) => {
    const rand = mulberry32(hashToSeed(`${i}:${formula}`));
    const randPct = () => `${rand() * 100}%`;
    const randRotate = () => rand() * 10 - 5;
    const randDuration = () => 20 + rand() * 20;

    return {
      id: i,
      formula,
      initial: { x: randPct(), y: randPct(), opacity: 0 },
      animate: {
        x: [randPct(), randPct(), randPct()],
        y: [randPct(), randPct(), randPct()],
        opacity: [0.1, 0.3, 0.1],
        rotate: [0, randRotate(), 0],
      },
      transition: {
        duration: randDuration(),
        repeat: Infinity,
        delay: i * 0.5,
        ease: "linear",
      },
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute font-mono text-sm text-text-muted/30 whitespace-nowrap"
          initial={item.initial}
          animate={item.animate}
          transition={item.transition}
        >
          {item.formula}
        </motion.div>
      ))}
    </div>
  );
}

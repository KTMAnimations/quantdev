import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = z
    .object({
      equity_curve: z.array(z.number()).min(5),
      n_sims: z.number().int().min(100).max(20000).default(1000),
      horizon: z.number().int().min(10).max(5000).default(252),
      seed: z.number().int().optional(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const pythonUrl = process.env.PYTHON_API_URL;
  if (!pythonUrl) {
    return NextResponse.json(
      { error: "PYTHON_API_URL is not configured" },
      { status: 500 },
    );
  }

  const response = await fetch(`${pythonUrl}/monte-carlo/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return NextResponse.json(
      { error: "Python API error", details: text },
      { status: 502 },
    );
  }

  const result = await response.json();
  return NextResponse.json(result);
}


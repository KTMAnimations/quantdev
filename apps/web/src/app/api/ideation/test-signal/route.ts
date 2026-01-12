import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = z
    .object({
      description: z.string().min(1),
      symbol: z.string().min(1),
      timeframe: z.string().min(1).default("1D"),
      lookback_days: z.number().int().min(30).max(5000).default(252),
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

  const response = await fetch(`${pythonUrl}/api/ideation/test-signal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: parsed.data.description,
      symbol: parsed.data.symbol,
      timeframe: parsed.data.timeframe,
      lookback_days: parsed.data.lookback_days,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return NextResponse.json(
      { error: "Python API error", details: text },
      { status: 502 },
    );
  }

  const json = await response.json().catch(() => null);
  const resultSchema = z
    .object({
      feature_name: z.string().optional(),
      recommendation: z.string().optional(),
      statistical_significance: z
        .object({
          ic_mean: z.number().nullable().optional(),
          ic_ir: z.number().nullable().optional(),
          p_value: z.number().nullable().optional(),
          is_significant: z.boolean().nullable().optional(),
        })
        .optional(),
      ml_importance: z
        .object({
          cv_accuracy: z.number().nullable().optional(),
          has_predictive_power: z.boolean().nullable().optional(),
        })
        .optional(),
    })
    .passthrough();

  const parsedResult = resultSchema.safeParse(json);
  if (!parsedResult.success) {
    return NextResponse.json({ error: "Invalid Python response" }, { status: 502 });
  }

  const result = parsedResult.data;
  const resultsJson = result as unknown as Prisma.InputJsonValue;

  await prisma.ideation.create({
    data: {
      userId: session.user.id,
      featureDescription: parsed.data.description,
      symbol: parsed.data.symbol,
      timeframe: parsed.data.timeframe,
      icMean: result?.statistical_significance?.ic_mean ?? null,
      icIr: result?.statistical_significance?.ic_ir ?? null,
      pValue: result?.statistical_significance?.p_value ?? null,
      isSignificant: result?.statistical_significance?.is_significant ?? null,
      mlAccuracy: result?.ml_importance?.cv_accuracy ?? null,
      hasPredictivePower: result?.ml_importance?.has_predictive_power ?? null,
      resultsJson,
    },
  });

  return NextResponse.json(result);
}


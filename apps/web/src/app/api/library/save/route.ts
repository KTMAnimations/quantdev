import { NextRequest, NextResponse } from "next/server";
import { StrategyType } from "@prisma/client";
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
      libraryId: z.string().min(1),
    })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const item = await prisma.strategyLibrary.findUnique({
    where: { id: parsed.data.libraryId },
  });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isIndicator = /indicator/i.test(item.category) || /indicator/i.test(item.name);
  const strategy = await prisma.strategy.create({
    data: {
      userId: session.user.id,
      name: item.name,
      description: item.description,
      pineCode: item.pineCode,
      type: isIndicator ? StrategyType.INDICATOR : StrategyType.STRATEGY,
      isPublic: false,
    },
  });

  return NextResponse.json({ strategyId: strategy.id });
}


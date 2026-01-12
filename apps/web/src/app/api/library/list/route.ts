import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const influencer = searchParams.get("influencer")?.trim() ?? "";

  const where: Prisma.StrategyLibraryWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { equals: category, mode: "insensitive" };
  }
  if (influencer.toLowerCase() === "true") {
    where.isInfluencer = true;
  }

  const items = await prisma.strategyLibrary.findMany({
    where,
    orderBy: [{ isInfluencer: "desc" }, { votes: "desc" }, { updatedAt: "desc" }],
    take: 200,
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      author: true,
      votes: true,
      isInfluencer: true,
    },
  });

  return NextResponse.json({ items });
}


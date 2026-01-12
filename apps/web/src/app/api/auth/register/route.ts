import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        error:
          "DATABASE_URL is not configured. Create apps/web/.env.local and set DATABASE_URL, then run: npx prisma db push",
      },
      { status: 500 },
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = z
      .object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1).max(120).optional(),
      })
      .safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
      },
      select: { id: true, email: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    const anyErr = err as { code?: string; message?: string };
    if (anyErr?.code === "P2002") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const message = err instanceof Error ? err.message : "";
    console.error("[register] failed:", err);

    if (/denied access/i.test(message)) {
      return NextResponse.json(
        {
          error:
            "Database access denied. Update DATABASE_URL (Homebrew Postgres is usually postgresql://<your-mac-username>@localhost:5432/openquant) and re-run: npx prisma db push",
        },
        { status: 500 },
      );
    }

    if (/does not exist|relation/i.test(message)) {
      return NextResponse.json(
        { error: "Database tables missing. Run: npx prisma db push" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Server error creating account. Check server logs." },
      { status: 500 },
    );
  }
}

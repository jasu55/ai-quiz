import { query } from "@/lib/connectDB";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const History = await prisma.articles.findMany();

  return NextResponse.json({
    data: History,
  });
}

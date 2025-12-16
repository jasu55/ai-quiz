import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await prisma.articles.findMany({
    where: { userid: userId },
    include: { quizzes: true },
    orderBy: { createdat: "desc" },
  });

  return NextResponse.json({ data: articles });
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleContent, articleTitle } = await req.json();

    if (!articleContent || !articleTitle) {
      return NextResponse.json(
        { error: "articleContent болон articleTitle заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    // Gemini API-аар summary гаргах
    const prompt = `Please provide a concise summary of the following article: ${articleContent}`;
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // Article хадгалах (Prisma ашиглан)
    const createdArticle = await prisma.articles.create({
      data: {
        title: articleTitle,
        content: articleContent,
        summary: summary,
        userid: userId,
      },
    });

    return NextResponse.json({
      message: "Article амжилттай үүслээ",
      data: createdArticle,
    });
  } catch (err: any) {
    console.error("POST /api/generate error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

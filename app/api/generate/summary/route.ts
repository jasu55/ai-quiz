import { query } from "@/lib/connectDB";
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
        { error: "articlecontent болон articleTitle заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    // Gemini API-аар summary гаргах
    console.log("Starting summary generation...");
    const prompt = `Please provide a concise summary of the following article: ${articleContent}`;
    console.log("API Key present:", !!process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    console.log("Model created");

    const result = await model.generateContent(prompt);
    console.log("Content generated");

    const response = await result.response;
    console.log("Response received");

    const summary = response.text();
    console.log("Summary extracted:", summary.substring(0, 50));
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
      data: createdArticle,
      id: createdArticle.id,
      message: "Амжилттай хадгаллаа",
    });
  } catch (err: any) {
    console.error("POST /api/generate/summary error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      apiKey: process.env.GEMINI_API_KEY ? "Set" : "Not set",
    });
    return NextResponse.json(
      { error: `Summary үүсгэхэд алдаа гарлаа: ${err.message}` },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleSummary, takeID } = await req.json();

    if (!articleSummary || !takeID) {
      return NextResponse.json(
        { error: "articleSummary болон takeID заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    // Verify the article belongs to the user
    const article = await prisma.articles.findFirst({
      where: {
        id: Number(takeID),
        userid: userId,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found or unauthorized" },
        { status: 404 }
      );
    }

    const prompt = `Generate 5 multiple choice questions based on this article: ${articleSummary}.
Return valid JSON like:
[
  { "question": "Question", "options": ["A","B","C","D"], "answer": "0" }
]`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const extractJsonArray = (t: string) => {
      const match = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      return match ? match[1].trim() : t.trim();
    };

    const cleaned = extractJsonArray(text);
    const quizList = JSON.parse(cleaned);

    // Prisma ашиглан Quiz-үүдийг хадгалах
    const createdQuizzes = await prisma.$transaction(
      quizList.map((quiz: any) =>
        prisma.quizzes.create({
          data: {
            question: quiz.question,
            options: quiz.options,
            answer: quiz.answer,
            articleid: Number(takeID),
          },
        })
      )
    );

    return NextResponse.json({
      message: "Quiz амжилттай үүслээ",
      data: createdQuizzes,
    });
  } catch (err: any) {
    console.error("POST /api/generate/quiz error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

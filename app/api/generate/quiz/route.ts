import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { articleSummary, takeID } = await req.json();

    if (!articleSummary || !takeID) {
      return NextResponse.json(
        { error: "articleSummary болон takeID заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    const prompt = `Generate 5 multiple choice questions based on this article: ${articleSummary}.
Return valid JSON like:
[
  { "question": "Question", "options": ["A","B","C","D"], "answer": "0" }
]`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = (aiResponse as any).text ?? aiResponse;

    const extractJsonArray = (t: string) => {
      const match = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      return match ? match[1].trim() : t.trim();
    };

    const cleaned = extractJsonArray(text.text || text);
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

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

const HomePage = () => {
  const [page, setPage] = useState<"home" | "summary" | "quiz" | "last">(
    "home"
  );
  const [articleTitle, setArticleTitle] = useState<string>("");
  const [articlecontent, setArticlecontent] = useState<string>("");

  const [articleSummary, setArticleSummary] = useState<string>("");
  const [takeID, setTakeID] = useState<string>("");
  const [generatedQuiz, setGeneratedQuiz] = useState<
    { question: string; options: string[]; answer: string }[]
  >([]);
  const [step, setStep] = useState(0);
  // const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    {
      question: string;
      selected: string;
      correct: string;
      isCorrect: boolean;
    }[]
  >([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const HandleOnContent = async () => {
    const response = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articlecontent, articleTitle }),
    });
    const rawData = await response.json();
    console.log({ rawData });
    if (rawData.data.length > 1) {
      setPage("summary");
    }
    setArticleSummary(rawData.data);
    setTakeID(rawData.id.rows[0].id);
  };

  const HandleOnPost = async () => {
    const response = await fetch("/api/postquiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleTitle, takeID }),
    });
    const rawData = await response.json();
    console.log({ rawData });
    const cleanedText = extractJsonArray(rawData.data);

    const parsedData = JSON.parse(cleanedText);
    setGeneratedQuiz(parsedData);
    setPage("quiz");
  };

  const extractJsonArray = (text: string) => {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    return match ? match[1].trim() : text.trim();
  };

  const HandleOnAnswer = (selectedIndex: number) => {
    const current = generatedQuiz[step];
    const correctIndex = parseInt(current.answer);
    const isCorrect = selectedIndex === correctIndex;
    const selected = current.options[selectedIndex];
    const correct = current.options[correctIndex];

    if (isCorrect) setCorrectAnswers((prev) => prev + 1);

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        selected,
        correct,
        isCorrect,
      },
    ]);

    if (step + 1 >= generatedQuiz.length) {
      setPage("last");
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-accent w-screen h-screen pt-30">
      {page === "home" && (
        <div className="w-[856px] h-fit ml-54  border-2 bg-white pt-5 rounded-lg">
          <div className="mx-7 mb-7">
            <div className="flex gap-2">
              <img src="/Vector.svg" />
              <div className="font-bold text-[32px]">
                Article Quiz Generator
              </div>
            </div>
            <div className="mt-2 text-[#71717A]">
              Paste your article below to generate a summarize and quiz
              question. Your articles will saved in the sidebar for future
              reference.
            </div>
            <div className="mt-5 text-[#71717A] flex gap-2">
              <img src="/Shape.svg" />
              Article title
            </div>
            <Input
              placeholder="Enter a title for your article.."
              type="text"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
            />
            <div className="mt-5 text-[#71717A] flex gap-2">
              <img src="/Shape.svg" />
              Article Content
            </div>
            <Textarea
              placeholder="Paste your article content here..."
              value={articlecontent}
              onChange={(e) => setArticlecontent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => HandleOnContent()}
                className="mt-5 "
                disabled={!articlecontent || !articleTitle}
              >
                Generate summary
              </Button>
            </div>
          </div>
        </div>
      )}
      {page === "summary" && (
        <div className="mt-10">
          <div className="h-72"></div>
          <div className="w-[856px] h-fit ml-114  border-2 bg-white">
            <div className="mx-7 mb-7">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">
                  Article Quiz Generator
                </div>
              </div>

              <div className="mt-5 text-[#71717A] flex gap-2">
                <img src="/Shape.svg" />
                Summarized Content
              </div>
              <div className="font-bold mt-4">{articleTitle}</div>
              <div className="mt-4">{articleSummary}</div>
              <div className="flex justify-between mt-5">
                <Button className="bg-white text-black border-2">
                  See content
                </Button>
                <Button onClick={() => HandleOnPost()} className=" ">
                  Take a quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {page === "quiz" && generatedQuiz[step] && (
        <div className="w-[700px] mt-50 mx-auto bg-white border-2 rounded-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Quick Test</h1>
            <Button variant="outline" onClick={() => setPage("home")}>
              X
            </Button>
          </div>

          <p className="text-gray-600 mt-2">
            Question {step + 1} / {generatedQuiz.length}
          </p>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-6">
              {generatedQuiz[step].question}
            </h2>

            <div className="flex flex-col gap-3 ">
              {generatedQuiz[step].options.map((opt, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => HandleOnAnswer(idx)}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { use, useEffect, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

const HomePage = () => {
  const [page, setPage] = useState<"home" | "summary" | "quiz" | "last">(
    "home"
  );
  const [articleTitle, setArticleTitle] = useState<string>("");
  const [articleContent, setArticleContent] = useState<string>("");

  const [articleSummary, setArticleSummary] = useState<string>("");
  const [takeID, setTakeID] = useState<string>("");

  const [generatedQuiz, setGeneratedQuiz] = useState<
    { question: string; options: string[]; answer: string }[]
  >([]);

  const [step, setStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    {
      question: string;
      selected: string;
      correct: string;
      isCorrect: boolean;
    }[]
  >([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [loading, setLoading] = useState(false);
  // const { user, isLoaded } = useUser();
  // const router = useRouter();

  // useEffect(() => {
  //   if (isLoaded && !user) {
  //     router.push("/login");
  //   }
  // }, [isLoaded, user]);

  // if (!isLoaded) {
  //   return <div>Loading...</div>;
  // }

  // 🧠 Summary үүсгэх
  const handleGenerateSummary = async () => {
    if (!articleContent || !articleTitle) return;
    try {
      setLoading(true);
      const res = await fetch("/api/generate/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleContent, articleTitle }),
      });
      const data = await res.json();
      console.log({ data });
      if (data.error) throw new Error(data.error);
      setArticleSummary(data.data.summary);
      setTakeID(data.data.id);
      setPage("summary");
    } catch (err: any) {
      alert("Summary үүсгэхэд алдаа гарлаа: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🤖 Quiz үүсгэх
  const handleGenerateQuiz = async () => {
    if (!articleSummary || !takeID) {
      alert("Summary болон ID дутуу байна!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/generate/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleSummary, takeID }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedQuiz(data.data);
      setStep(0);
      setUserAnswers([]);
      setCorrectAnswers(0);
      setPage("quiz");
    } catch (err: any) {
      alert("Quiz үүсгэхэд алдаа гарлаа: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const HandleOnAnswer = (selectedIndex: number) => {
    const current = generatedQuiz[step];
    const correctIndex = parseInt(current.answer);
    const isCorrect = selectedIndex === correctIndex;
    const selected = current.options[selectedIndex];
    const correct = current.options[correctIndex];
    const question = current.question;
    if (isCorrect) setCorrectAnswers((prev) => prev + 1);

    setUserAnswers((prev) => [
      ...prev,
      {
        question,
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
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => handleGenerateSummary()}
                className="mt-5 "
                disabled={!articleContent || !articleTitle}
              >
                {loading ? "..." : "Generate summary"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {page === "summary" && (
        <div className="mt-10 ">
          <button
            className="flex items-center gap-2 bg-white p-4 cursor-pointer rounded-sm ml-114 mb-5 border-2"
            onClick={() => setPage("home")}
          >
            <MdOutlineKeyboardArrowLeft />
          </button>
          <div className="w-[856px] rounded-sm h-fit ml-114  border-2 bg-white">
            <div className="mx-7 mb-7">
              <div className="flex gap-2 mt-5">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">
                  Article Quiz Generator
                </div>
              </div>

              <div className="mt-20 text-[#71717A] flex gap-2">
                <img src="/Shape.svg" />
                Summarized Content
              </div>
              <div className="font-bold mt-4">{articleTitle}</div>
              <div className="mt-4">{articleSummary}</div>
              <div className="flex justify-between mt-5">
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <Button variant="outline">See content</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogTitle>{articleTitle}</DialogTitle>
                      <div>{articleContent}</div>
                    </DialogContent>
                  </form>
                </Dialog>

                <Button onClick={() => handleGenerateQuiz()} className=" ">
                  {loading ? "..." : "Take a quiz"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {page === "quiz" && generatedQuiz[step] && (
        <div className="w-[700px] mt-10 mx-auto bg-white border-2 rounded-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Quick Test</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline"> X</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-red-600">
                    If you press 'Cancel', this quiz will restart from the
                    beginning.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className=" space-x-20">
                  <AlertDialogCancel className="px-15">
                    Go back
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="px-15"
                    onClick={() => {
                      setStep(0);
                    }}
                  >
                    Cancel quiz
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
      {page === "last" && (
        <div className="w-[600px] h-fit ml-64 mt-10">
          <div className="mx-7">
            <div className="flex justify-between w-[600px]">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">Quiz completed</div>
              </div>
            </div>

            <div className="mt-2 text-[#71717A]">Let's see what you did</div>
            <div className="mt-6 border-2 bg-white rounded-md w-[600px] p-6">
              <div className="font-bold text-[32px]">
                Your score: {correctAnswers}
                <span className="text-[#71717A] text-[20px]">
                  / {generatedQuiz.length}
                </span>
              </div>

              <div className="mt-5">
                {userAnswers.map((ans, index) => (
                  <div key={index} className="flex gap-3 mb-4">
                    <img
                      src={ans.isCorrect ? "/rigth.svg" : "/wrong.svg"}
                      className="w-6 h-6 mt-1"
                    />
                    <div>
                      <div className="text-[#737373] font-medium">
                        {index + 1}. {ans.question}
                      </div>
                      <div className="text-[#171717]">
                        Your answer: {ans.selected}
                      </div>
                      <div
                        className={
                          ans.isCorrect ? "text-[#22C55E]" : "text-[#EF4444]"
                        }
                      >
                        Correct: {ans.correct}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between my-7">
                <Button
                  className="w-44 h-10 bg-white text-black border-2 text-[20px]"
                  onClick={() => {
                    setStep(0);
                    setCorrectAnswers(0);
                    setUserAnswers([]);
                    setPage("quiz");
                  }}
                >
                  <img src="/reload.svg" /> Restart quiz
                </Button>
                <Button
                  className="w-44 h-10"
                  onClick={() => {
                    setPage("home");
                    setStep(0);
                    setCorrectAnswers(0);
                    setUserAnswers([]);
                    setArticleTitle("");
                    setArticleContent("");
                    setArticleSummary("");
                  }}
                >
                  <img src="/favorite.svg" />
                  Save and leave
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LuBookOpen } from "react-icons/lu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const HistoryPage = () => {
  const params = useParams();
  const articleId = params.id;
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("id:", articleId);
        const response = await fetch(`/api/history/${articleId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch history: ${response.statusText}`);
        }

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchData();
    }
  }, [articleId]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!result || !result.data || result.data.length === 0) {
    return <div className="p-10">No data found</div>;
  }
  return (
    <div className="mt-30">
      <div className="w-[628px] h-fit ml-34  border-2 bg-white">
        <div className="mx-7 mb-7">
          <div className="flex gap-2">
            <img src="/Vector.svg" />
            <div className="font-bold text-[32px]">Article Quiz Generator</div>
          </div>

          <div className="mt-5 text-[#71717A] flex gap-2 items-center">
            <LuBookOpen />
            Summarized content
          </div>
          <div className="text-[24px] font-bold">
            {result.data[0].articletitle}
          </div>
          <div>{result.data[0].articlesummary}</div>
          <div className="mt-5 text-[#71717A] flex gap-2">
            <img src="/Shape.svg" />
            Article Content
          </div>
          <div className="h-[60px] flex flex-wrap w-[572px] text-ellipsis ">
            <div className=" w-[572px] h-60px] truncate  ">
              {result.data[0].articlecontent}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-115 mt-3 bg-white text-black ">
                  See more
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="">
                  <DialogHeader>
                    <DialogTitle>
                      <div className="text-[24px] font-bold">Genghis Khan</div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className=" mt-5 ">{result.data[0].articlecontent}</div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-start">
            <Button className="mt-5 ">Take quiz</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HistoryPage;

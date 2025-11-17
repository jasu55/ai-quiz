"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();
  const [history, setHistory] = useState<{ title: string; id: string }[]>([]);

  const getHistory = async () => {
    const res = await fetch("/api/history");
    const responseData = await res.json();
    const data = responseData.data;
    console.log("history data:", data);
    setHistory(data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const HistoryOnclick = (data: { id: string }) => {
    const ID = data.id;
    router.push(`/history/${ID}`);
  };

  const DeleteTitle = async (data: { id: string }) => {
    if (
      confirm("Are you sure you want to delete this history item?") === true
    ) {
      const ID = data.id;

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/history/${ID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID }),
        cache: "no-store",
      });
      getHistory();
      return response;
    } else {
      return;
    }
  };

  return (
    <Sidebar className="mt-16">
      <div className="flex items-center mx-4 justify-between  gap-20 mt-4 ">
        <div className="font-extrabold h-7">History</div>
        <SidebarTrigger className="h-6 w-6 " />
      </div>

      <SidebarHeader />
      <SidebarContent>
        <div className="mx-4">
          {history && (
            <div>
              {history.map((data, index) => (
                <div key={index} className="h-6 font-semibold my-2 ">
                  <div className="flex w-[223px] justify-between">
                    <div onClick={() => HistoryOnclick(data)}>{data.title}</div>
                    <img
                      onClick={() => DeleteTitle(data)}
                      src="/delete.svg
                  "
                    ></img>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

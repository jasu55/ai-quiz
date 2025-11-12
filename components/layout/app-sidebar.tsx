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
import { useRouter } from "next/router";

export function AppSidebar() {
  // const router = useRouter();
  const [history, setHistory] = useState<
    { articletitle: string; id: string }[]
  >([]);

  const getHistory = async () => {
    const res = await fetch("/api/history");
    const responseData = await res.json();
    const data = responseData.data;
    setHistory(data.rows);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const HistoryOnclick = (data: { id: string }) => {
    const ID = data.id;
    // router.push(`/protected/history/${ID}`);
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
          {history.map((data, index) => (
            <div
              key={index}
              onClick={() => HistoryOnclick(data)}
              className="h-6 font-semibold my-2 "
            >
              {data.articletitle}
            </div>
          ))}
        </div>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

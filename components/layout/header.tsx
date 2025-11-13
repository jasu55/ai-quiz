"use client";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-16 items-center flex border-b-2 fixed  bg-accent">
      <button
        onClick={() => router.push("/")}
        className="pl-10 font-semibold text-[30px] text-sm:text-[36px]  h-10 bg-transparent border-0 cursor-pointer"
      >
        Quiz app
      </button>
      <div className="text-[26px] ml-490">
        <UserButton />
      </div>
    </div>
  );
};

export default Header;

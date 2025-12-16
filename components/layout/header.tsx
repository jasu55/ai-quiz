"use client";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-16 items-center flex justify-between border-b-2 fixed bg-accent px-10 z-50">
      <button
        onClick={() => router.push("/")}
        className="font-semibold text-[30px] sm:text-[36px] h-10 bg-transparent border-0 cursor-pointer"
      >
        Quiz app
      </button>
      <div className="flex items-center">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Header;

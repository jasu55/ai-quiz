"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex items-center h-screen justify-center w-screen bg-amber-700 ">
      <SignIn routing="hash" />
    </div>
  );
};

export default page;

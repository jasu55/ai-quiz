"use client";

import { SignIn } from "@clerk/clerk-react";

const page = () => {
  return (
    <div>
      <SignIn routing="hash" />
    </div>
  );
};

export default page;

"use client";

import { Button } from "../ui/button";
import { useSignUpModel } from "@/hooks/models";

const GlobalSignUpBtn = () => {
  const { open } = useSignUpModel();
  return (
    <div>
      <Button onClick={open}>Sign Up</Button>
    </div>
  );
};

export default GlobalSignUpBtn;

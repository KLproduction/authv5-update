"use client";

import { Button } from "../ui/button";
import { useSignInModel } from "@/hooks/models";

const GlobalSignInBtn = () => {
  const { open } = useSignInModel();
  return (
    <div>
      <Button onClick={open}>Sign In</Button>
    </div>
  );
};

export default GlobalSignInBtn;

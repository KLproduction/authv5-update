"use client";
import { Button } from "../ui/button";
import { CgLogOut } from "react-icons/cg";
import { useSignOut } from "@/hooks/auth";

const SignOutBtn = () => {
  const { signOutMutate } = useSignOut();

  return (
    <div className="flex items-center w-full">
      <Button onClick={() => signOutMutate()} variant={"ghost"} size={"sm"}>
        <div className="mr-3 flex">Sign Out</div>
        <div className="text-lg">
          <CgLogOut />
        </div>
      </Button>
    </div>
  );
};

export default SignOutBtn;

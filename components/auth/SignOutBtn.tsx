"use client";
import { signOutAction } from "@/actions/signOut";
import { Button } from "../ui/button";
import { CgLogOut } from "react-icons/cg";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSignOut } from "@/hooks/auth";

const SignOutBtn = () => {
  // const queryClient = useQueryClient();
  // const route = useRouter();

  // const onClickHandler = async () => {
  //   await signOutAction();
  //   route.refresh();
  //   queryClient.invalidateQueries({ queryKey: ["current"] });
  // };

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

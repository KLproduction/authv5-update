"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useGetCurrentUser } from "@/hooks/auth";
import { useSession } from "next-auth/react";
import SignOutBtn from "./SignOutBtn";

export const UserBtn = () => {
  const user = useGetCurrentUser();
  console.log("UserBtn user", user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className=" bg-orange-300">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-40" align="center" sideOffset={10}>
        <DropdownMenuItem asChild>
          <div className="w-full">
            <SignOutBtn />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { LoginForm } from "./LoginForm";
import { useMedia } from "react-use";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSignInModel } from "@/hooks/models";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButtonProps = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const route = useRouter();
  const { open, close, isOpen } = useSignInModel();
  const isDesktop = useMedia("(min-width: 1024px)", true);

  const onClick = () => {
    route.push("/auth/login");
  };
  if (mode === "modal") {
    if (isDesktop) {
      return (
        <Dialog>
          <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
          <DialogContent className=" p-0 w-auto bg-white bg-transparent border-none">
            <VisuallyHidden>
              <DialogTitle>Sign in</DialogTitle>
            </VisuallyHidden>
            <LoginForm />
          </DialogContent>
        </Dialog>
      );
    } else {
      return (
        <Drawer>
          <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
          <DrawerTitle>
            <DialogDescription></DialogDescription>
          </DrawerTitle>
          <DrawerContent>
            <div className="hide-scrollbar max-h-[90vh] overflow-y-auto flex justify-center">
              <LoginForm />
            </div>
          </DrawerContent>
        </Drawer>
      );
    }
  } else {
    return (
      <span onClick={onClick} className=" cursor-pointer m-0 p-0">
        {children}
      </span>
    );
  }
};

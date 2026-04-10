"use client";

import { LoginForm } from "./LoginForm";
import ResponsiveModel from "../global/responsive-model";
import { useSignInModel } from "@/hooks/models";

export const SignInModel = () => {
  const { close, isOpen, setIsOpen } = useSignInModel();
  return (
    <ResponsiveModel isOpen={isOpen} onOpenChange={setIsOpen}>
      <LoginForm />
    </ResponsiveModel>
  );
};

"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Social } from "./Social";
import { Header } from "./header";
import { useSignInModel, useSignUpModel } from "@/hooks/models";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backBtnLabel: string;
  backBtnHref: string;
  showSocial?: boolean;
  noShadowOrBorder?: boolean; // new prop
}

export const CardWapper = ({
  children,
  headerLabel,
  backBtnLabel,
  backBtnHref,
  showSocial,
  noShadowOrBorder = false,
}: CardWrapperProps) => {
  const { open: openSignIn, close: closeSignIn } = useSignInModel();
  const { open: openSignUp, close: closeSignUp } = useSignUpModel();
  const handleBackBtnClick =
    backBtnLabel.toLowerCase().includes("sign up")
      ? (e: React.MouseEvent) => {
          e.preventDefault();
          closeSignIn();
          openSignUp();
        }
      : backBtnLabel.toLowerCase().includes("sign in")
      ? (e: React.MouseEvent) => {
          e.preventDefault();
          closeSignUp();
          openSignIn();
        }
      : undefined;

  return (
    <Card
      className={`w-full max-w-[440px] border-border/70 bg-card/95 shadow-xl shadow-black/5 backdrop-blur-sm ${
        noShadowOrBorder ? "border-none shadow-none" : ""
      }`}
    >
      <CardHeader className="space-y-3 px-6 pt-8">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">{children}</CardContent>
      {showSocial && (
        <CardFooter className="px-6 pb-2 pt-0">
          <Social />
        </CardFooter>
      )}
      <div className="flex items-center justify-center px-6 pb-8">
        <Link
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          href={backBtnHref}
          onClick={handleBackBtnClick}
        >
          {backBtnLabel}
        </Link>
      </div>
    </Card>
  );
};

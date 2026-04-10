import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButtonProps } from "@/components/auth/loginBtn";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import GoogleSignInBtn from "@/components/auth/GoogleSignInBtn";
import GitSignInBtn from "@/components/auth/GitSignInBtn";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-zinc-200">
      <div className="flex flex-col gap-5 justify-center items-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md mb-5",
            font.className
          )}
        >
          Login
        </h1>
        <div>
          <LoginButtonProps mode="modal" asChild>
            <Button variant={"secondary"} size={"lg"}>
              Sign In
            </Button>
          </LoginButtonProps>
        </div>
        <GoogleSignInBtn />
        <GitSignInBtn />
      </div>
    </main>
  );
}

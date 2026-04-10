"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { loginFlow } from "@/lib/auth-flow";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenbyEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>,
  callbackUrl?:string|null
) => {
  const redirectTo = callbackUrl ?? undefined;
  const flow = await loginFlow(values, {
    getUserByEmail,
    generateVerificationToken,
    sendVerificationEmail,
    getTwoFactorTokenByEmail: getTwoFactorTokenbyEmail,
    generateTwoFactorToken,
    sendTwoFactorTokenEmail,
    getTwoFactorConfirmationByUserId,
    deleteTwoFactorToken: async (id) => {
      await db.twoFactorToken.delete({ where: { id } });
    },
    deleteTwoFactorConfirmation: async (id) => {
      await db.twoFactorConfirmation.delete({ where: { id } });
    },
    createTwoFactorConfirmation: async (userId) => {
      await db.twoFactorConfirmation.create({ data: { userId } });
    },
  }, redirectTo);

  if (flow.kind === "sign-in") {
    try {
      await signIn("credentials", {
        email: flow.email,
        password: flow.password,
        redirectTo: flow.redirectTo,
      });
    } catch (e) {
      if (e instanceof AuthError) {
        switch (e.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials!" };
          default:
            return { error: "Invalid credentials!" };
        }
      }
      throw e;
    }

    return;
  }

  if (flow.kind === "two-factor") {
    return { twoFactor: true };
  }

  return flow;
};

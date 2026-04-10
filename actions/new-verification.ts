"use server";

import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { getVerificationTokenBytoken } from "@/data/verification-token";
import { newVerificationFlow } from "@/lib/auth-flow";

export const newVerification = async (token: string, userId?: string) => {
  return newVerificationFlow(token, userId, {
    getVerificationTokenByToken: getVerificationTokenBytoken,
    getUserById,
    getUserByEmail,
    updateUserEmailAndVerification: async (selector, email) => {
      if (selector.id) {
        await db.user.update({
          where: { id: selector.id },
          data: {
            email,
            emailVerified: new Date(),
          },
        });
        return;
      }

      if (selector.email) {
        await db.user.update({
          where: { email: selector.email },
          data: {
            email,
            emailVerified: new Date(),
          },
        });
      }
    },
    deleteVerificationToken: async (id) => {
      await db.verificationToken.delete({
        where: { id },
      });
    },
  });
};

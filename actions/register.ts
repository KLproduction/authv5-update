"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { registerFlow } from "@/lib/auth-flow";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  return registerFlow(values, {
    getUserByEmail,
    createUser: async (input) => {
      await db.user.create({ data: input });
    },
    hashPassword: async (password) => bcrypt.hash(password, 10),
    generateVerificationToken,
    sendVerificationEmail,
  });
};

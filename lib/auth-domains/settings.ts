import * as z from "zod";
import { SettingSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
import { isAdmin } from "@/lib/role-policy";

type SettingValues = z.infer<typeof SettingSchema>;

type SessionUser = {
  id: string;
  email?: string | null;
  isOAuth?: boolean;
};

type DbUser = {
  id: string;
  email: string | null;
  password: string | null;
  role: UserRole;
};

type ExistingUser = {
  id: string;
  email: string | null;
};

type VerificationToken = {
  email: string;
  token: string;
};

export type SettingsResult =
  | { success: string }
  | { error: string };

export interface SettingsDeps {
  getUserById(id: string): Promise<DbUser | null>;
  getUserByEmail(email: string): Promise<ExistingUser | null>;
  generateVerificationToken(email: string): Promise<VerificationToken>;
  sendVerificationEmail(email: string, token: string): Promise<void>;
  comparePassword(plain: string, hash: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  updateUser(id: string, values: Partial<SettingValues> & { password?: string }): Promise<void>;
}

export async function settingsFlow(
  values: SettingValues,
  user: SessionUser,
  deps: SettingsDeps
): Promise<SettingsResult> {
  const dbUser = await deps.getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const nextValues: SettingValues = { ...values };

  if (user.isOAuth) {
    nextValues.email = undefined;
    nextValues.password = undefined;
    nextValues.newPassword = undefined;
    nextValues.isTwoFactorEnabled = undefined;
  }

  if (!isAdmin(dbUser.role)) {
    nextValues.role = dbUser.role;
  }

  if (nextValues.email && nextValues.email !== user.email) {
    const existingUser = await deps.getUserByEmail(nextValues.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in used!" };
    }

    const verificationToken = await deps.generateVerificationToken(nextValues.email);
    await deps.sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent!" };
  }

  if (nextValues.password && nextValues.newPassword && dbUser.password) {
    const passwordMatch = await deps.comparePassword(
      nextValues.password,
      dbUser.password
    );

    if (!passwordMatch) {
      return { error: "Incorrect password" };
    }

    nextValues.password = await deps.hashPassword(nextValues.newPassword);
    nextValues.newPassword = undefined;
  }

  await deps.updateUser(dbUser.id, nextValues);

  return { success: "Setting updated!" };
}

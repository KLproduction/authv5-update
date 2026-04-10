import * as z from "zod";
import { LoginSchema, NewPasswordSchema, RegisterSchema, ResetSchema } from "@/schemas";

type MaybePromise<T> = T | Promise<T>;

type UserRecord = {
  id: string;
  email: string | null;
  password: string | null;
  emailVerified: Date | null;
  isTwoFactorEnabled?: boolean;
};

type VerificationTokenRecord = {
  id: string;
  email: string;
  token: string;
  expires: Date;
};

type TwoFactorTokenRecord = {
  id: string;
  email: string;
  token: string;
  expires: Date;
};

type TwoFactorConfirmationRecord = {
  id: string;
};

export type LoginFlowInput = z.infer<typeof LoginSchema>;
export type RegisterFlowInput = z.infer<typeof RegisterSchema>;
export type ResetFlowInput = z.infer<typeof ResetSchema>;
export type NewPasswordFlowInput = z.infer<typeof NewPasswordSchema>;

export type LoginFlowResult =
  | { kind: "sign-in"; email: string; password: string; redirectTo: string }
  | { kind: "two-factor"; twoFactor: true }
  | { kind: "success"; success: string }
  | { kind: "error"; error: string };

export type StandardFlowResult =
  | { success: string; error?: never }
  | { error: string; success?: never };

export interface LoginFlowDeps {
  getUserByEmail(email: string): MaybePromise<UserRecord | null>;
  generateVerificationToken(email: string): MaybePromise<VerificationTokenRecord>;
  sendVerificationEmail(email: string, token: string): MaybePromise<void>;
  getTwoFactorTokenByEmail(email: string): MaybePromise<TwoFactorTokenRecord | null>;
  generateTwoFactorToken(email: string): MaybePromise<TwoFactorTokenRecord>;
  sendTwoFactorTokenEmail(email: string, token: string): MaybePromise<void>;
  getTwoFactorConfirmationByUserId(userId: string): MaybePromise<TwoFactorConfirmationRecord | null>;
  deleteTwoFactorToken(id: string): MaybePromise<void>;
  deleteTwoFactorConfirmation(id: string): MaybePromise<void>;
  createTwoFactorConfirmation(userId: string): MaybePromise<void>;
}

export interface RegisterFlowDeps {
  getUserByEmail(email: string): MaybePromise<UserRecord | null>;
  createUser(input: { name: string; email: string; password: string }): MaybePromise<void>;
  hashPassword(password: string): MaybePromise<string>;
  generateVerificationToken(email: string): MaybePromise<VerificationTokenRecord>;
  sendVerificationEmail(email: string, token: string): MaybePromise<void>;
}

export interface ResetFlowDeps {
  getUserByEmail(email: string): MaybePromise<UserRecord | null>;
  generateResetPasswordToken(email: string): MaybePromise<VerificationTokenRecord>;
  sendPasswordResetEmail(email: string, token: string): MaybePromise<void>;
}

export interface NewPasswordFlowDeps {
  getPasswordResetTokenByToken(token: string): MaybePromise<VerificationTokenRecord | null>;
  getUserByEmail(email: string): MaybePromise<UserRecord | null>;
  hashPassword(password: string): MaybePromise<string>;
  updateUserPassword(userId: string, password: string): MaybePromise<void>;
  deletePasswordResetToken(id: string): MaybePromise<void>;
}

export interface NewVerificationFlowDeps {
  getVerificationTokenByToken(token: string): MaybePromise<VerificationTokenRecord | null>;
  getUserById(userId: string): MaybePromise<UserRecord | null>;
  getUserByEmail(email: string): MaybePromise<UserRecord | null>;
  updateUserEmailAndVerification(userIdOrEmail: { id?: string; email?: string }, email: string): MaybePromise<void>;
  deleteVerificationToken(id: string): MaybePromise<void>;
}

export async function loginFlow(
  values: LoginFlowInput,
  deps: LoginFlowDeps,
  callbackUrl = "/"
): Promise<LoginFlowResult> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { kind: "error", error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;
  const existingUser = await deps.getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { kind: "error", error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await deps.generateVerificationToken(existingUser.email);
    await deps.sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { kind: "success", success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await deps.getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { kind: "error", error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { kind: "error", error: "Invalid code!" };
      }

      if (new Date(twoFactorToken.expires) < new Date()) {
        return { kind: "error", error: "Code expired!" };
      }

      await deps.deleteTwoFactorToken(twoFactorToken.id);

      const existingConfirmation = await deps.getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await deps.deleteTwoFactorConfirmation(existingConfirmation.id);
      }

      await deps.createTwoFactorConfirmation(existingUser.id);
    } else {
      const twoFactorToken = await deps.generateTwoFactorToken(existingUser.email);
      await deps.sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
      return { kind: "two-factor", twoFactor: true };
    }
  }

  return {
    kind: "sign-in",
    email,
    password,
    redirectTo: callbackUrl || "/",
  };
}

export async function registerFlow(
  values: RegisterFlowInput,
  deps: RegisterFlowDeps
): Promise<StandardFlowResult> {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const existingUser = await deps.getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  const hashedPassword = await deps.hashPassword(password);
  await deps.createUser({ name, email, password: hashedPassword });

  const verificationToken = await deps.generateVerificationToken(email);
  await deps.sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Account Created! (Confirmation email not process in this stage.)" };
}

export async function resetFlow(
  values: ResetFlowInput,
  deps: ResetFlowDeps
): Promise<StandardFlowResult> {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;
  const existingUser = await deps.getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await deps.generateResetPasswordToken(email);
  await deps.sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset mail sent!" };
}

export async function newPasswordFlow(
  values: NewPasswordFlowInput,
  token: string | null | undefined,
  deps: NewPasswordFlowDeps
): Promise<StandardFlowResult> {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const existingToken = await deps.getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: "Token has expired!" };
  }

  const existingUser = await deps.getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await deps.hashPassword(validatedFields.data.password);
  await deps.updateUserPassword(existingUser.id, hashedPassword);
  await deps.deletePasswordResetToken(existingToken.id);

  return { success: "Password updated" };
}

export async function newVerificationFlow(
  token: string | null | undefined,
  userId: string | undefined,
  deps: NewVerificationFlowDeps
): Promise<StandardFlowResult> {
  if (!token) {
    return { error: "Missing Token" };
  }

  const existingToken = await deps.getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token dose not exist!" };
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: "Token has expired!" };
  }

  if (userId && userId !== "undefined") {
    const existingUser = await deps.getUserById(userId);

    if (!existingUser) {
      return { error: "User dose not exist" };
    }

    await deps.updateUserEmailAndVerification({ id: userId }, existingToken.email);
  } else {
    const existingUser = await deps.getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "email dose not exist" };
    }

    await deps.updateUserEmailAndVerification({ email: existingUser.email ?? undefined }, existingToken.email);
  }

  await deps.deleteVerificationToken(existingToken.id);

  return { success: "Email verified!" };
}

import test from "node:test";
import assert from "node:assert/strict";
import { loginFlow, registerFlow, resetFlow, newPasswordFlow, newVerificationFlow } from "../lib/auth-flow";

test("loginFlow asks for verification when email is unverified", async () => {
  const calls: string[] = [];

  const result = await loginFlow(
    { email: "a@example.com", password: "secret", code: "" },
    {
      getUserByEmail: async () => ({
        id: "u1",
        email: "a@example.com",
        password: "hash",
        emailVerified: null,
        isTwoFactorEnabled: false,
      }),
      generateVerificationToken: async (email) => {
        calls.push(`token:${email}`);
        return { id: "v1", email, token: "vtok", expires: new Date(Date.now() + 1000) };
      },
      sendVerificationEmail: async (email, token) => {
        calls.push(`mail:${email}:${token}`);
      },
      getTwoFactorTokenByEmail: async () => null,
      generateTwoFactorToken: async () => {
        throw new Error("not expected");
      },
      sendTwoFactorTokenEmail: async () => {
        throw new Error("not expected");
      },
      getTwoFactorConfirmationByUserId: async () => null,
      deleteTwoFactorToken: async () => {},
      deleteTwoFactorConfirmation: async () => {},
      createTwoFactorConfirmation: async () => {},
    }
  );

  assert.equal(result.kind, "success");
  assert.equal(calls[0], "token:a@example.com");
  assert.equal(calls[1], "mail:a@example.com:vtok");
});

test("loginFlow requests 2FA when enabled and code is missing", async () => {
  const sent: string[] = [];

  const result = await loginFlow(
    { email: "a@example.com", password: "secret", code: "" },
    {
      getUserByEmail: async () => ({
        id: "u1",
        email: "a@example.com",
        password: "hash",
        emailVerified: new Date(),
        isTwoFactorEnabled: true,
      }),
      generateVerificationToken: async () => {
        throw new Error("not expected");
      },
      sendVerificationEmail: async () => {},
      getTwoFactorTokenByEmail: async () => null,
      generateTwoFactorToken: async (email) => {
        sent.push(email);
        return { id: "t1", email, token: "123456", expires: new Date(Date.now() + 1000) };
      },
      sendTwoFactorTokenEmail: async (email, token) => {
        sent.push(`${email}:${token}`);
      },
      getTwoFactorConfirmationByUserId: async () => null,
      deleteTwoFactorToken: async () => {},
      deleteTwoFactorConfirmation: async () => {},
      createTwoFactorConfirmation: async () => {},
    }
  );

  assert.equal(result.kind, "two-factor");
  assert.deepEqual(sent, ["a@example.com", "a@example.com:123456"]);
});

test("loginFlow returns sign-in intent once 2FA is confirmed", async () => {
  const calls: string[] = [];

  const result = await loginFlow(
    { email: "a@example.com", password: "secret", code: "123456" },
    {
      getUserByEmail: async () => ({
        id: "u1",
        email: "a@example.com",
        password: "hash",
        emailVerified: new Date(),
        isTwoFactorEnabled: true,
      }),
      generateVerificationToken: async () => {
        throw new Error("not expected");
      },
      sendVerificationEmail: async () => {},
      getTwoFactorTokenByEmail: async () => ({
        id: "t1",
        email: "a@example.com",
        token: "123456",
        expires: new Date(Date.now() + 1000),
      }),
      generateTwoFactorToken: async () => {
        throw new Error("not expected");
      },
      sendTwoFactorTokenEmail: async () => {},
      getTwoFactorConfirmationByUserId: async () => null,
      deleteTwoFactorToken: async (id) => {
        calls.push(`delete-token:${id}`);
      },
      deleteTwoFactorConfirmation: async () => {},
      createTwoFactorConfirmation: async (userId) => {
        calls.push(`confirm:${userId}`);
      },
    }
  );

  assert.equal(result.kind, "sign-in");
  assert.equal(result.redirectTo, "/");
  assert.equal(calls[0], "delete-token:t1");
  assert.equal(calls[1], "confirm:u1");
});

test("registerFlow creates user and sends verification email", async () => {
  const calls: string[] = [];

  const result = await registerFlow(
    { name: "User", email: "user@example.com", password: "Password123!" },
    {
      getUserByEmail: async () => null,
      hashPassword: async (password) => `hash:${password}`,
      createUser: async (input) => {
        calls.push(`create:${input.email}:${input.password}`);
      },
      generateVerificationToken: async (email) => ({
        id: "v1",
        email,
        token: "verify",
        expires: new Date(Date.now() + 1000),
      }),
      sendVerificationEmail: async (email, token) => {
        calls.push(`mail:${email}:${token}`);
      },
    }
  );

  assert.equal(result.success, "Account Created! (Confirmation email not process in this stage.)");
  assert.deepEqual(calls, ["create:user@example.com:hash:Password123!", "mail:user@example.com:verify"]);
});

test("resetFlow sends a reset email for an existing account", async () => {
  const calls: string[] = [];

  const result = await resetFlow(
    { email: "user@example.com" },
    {
      getUserByEmail: async () => ({ id: "u1", email: "user@example.com", password: "hash", emailVerified: new Date() }),
      generateResetPasswordToken: async (email) => ({
        id: "r1",
        email,
        token: "reset",
        expires: new Date(Date.now() + 1000),
      }),
      sendPasswordResetEmail: async (email, token) => {
        calls.push(`mail:${email}:${token}`);
      },
    }
  );

  assert.equal(result.success, "Reset mail sent!");
  assert.deepEqual(calls, ["mail:user@example.com:reset"]);
});

test("newPasswordFlow updates password and deletes reset token", async () => {
  const calls: string[] = [];

  const result = await newPasswordFlow(
    { password: "NewPassword123!" },
    "reset-token",
    {
      getPasswordResetTokenByToken: async () => ({
        id: "r1",
        email: "user@example.com",
        token: "reset-token",
        expires: new Date(Date.now() + 1000),
      }),
      getUserByEmail: async () => ({ id: "u1", email: "user@example.com", password: "hash", emailVerified: new Date() }),
      hashPassword: async (password) => `hash:${password}`,
      updateUserPassword: async (userId, password) => {
        calls.push(`update:${userId}:${password}`);
      },
      deletePasswordResetToken: async (id) => {
        calls.push(`delete:${id}`);
      },
    }
  );

  assert.equal(result.success, "Password updated");
  assert.deepEqual(calls, ["update:u1:hash:NewPassword123!", "delete:r1"]);
});

test("newVerificationFlow verifies email and removes token", async () => {
  const calls: string[] = [];

  const result = await newVerificationFlow(
    "verify-token",
    "u1",
    {
      getVerificationTokenByToken: async () => ({
        id: "v1",
        email: "user@example.com",
        token: "verify-token",
        expires: new Date(Date.now() + 1000),
      }),
      getUserById: async () => ({ id: "u1", email: "old@example.com", password: "hash", emailVerified: null }),
      getUserByEmail: async () => null,
      updateUserEmailAndVerification: async (selector, email) => {
        calls.push(`update:${selector.id ?? selector.email}:${email}`);
      },
      deleteVerificationToken: async (id) => {
        calls.push(`delete:${id}`);
      },
    }
  );

  assert.equal(result.success, "Email verified!");
  assert.deepEqual(calls, ["update:u1:user@example.com", "delete:v1"]);
});

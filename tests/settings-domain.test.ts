import test from "node:test";
import assert from "node:assert/strict";
import { UserRole } from "@prisma/client";
import { settingsFlow } from "../lib/auth-domains/settings";

test("settingsFlow locks role for non-admin users", async () => {
  const calls: string[] = [];

  const result = await settingsFlow(
    {
      name: "User",
      email: "user@example.com",
      password: undefined,
      newPassword: undefined,
      role: UserRole.ADMIN,
      isTwoFactorEnabled: false,
    },
    { id: "u1", email: "user@example.com", isOAuth: false },
    {
      getUserById: async () => ({
        id: "u1",
        email: "user@example.com",
        password: "hash",
        role: UserRole.USER,
      }),
      getUserByEmail: async () => null,
      generateVerificationToken: async () => {
        throw new Error("not expected");
      },
      sendVerificationEmail: async () => {},
      comparePassword: async () => true,
      hashPassword: async () => "hashed",
      updateUser: async (id, values) => {
        calls.push(`${id}:${values.role}`);
      },
    }
  );

  assert.equal(result.success, "Setting updated!");
  assert.equal(calls[0], "u1:USER");
});

test("settingsFlow sends verification email when email changes", async () => {
  const calls: string[] = [];

  const result = await settingsFlow(
    {
      name: "User",
      email: "new@example.com",
      password: undefined,
      newPassword: undefined,
      role: UserRole.USER,
      isTwoFactorEnabled: false,
    },
    { id: "u1", email: "old@example.com", isOAuth: false },
    {
      getUserById: async () => ({
        id: "u1",
        email: "old@example.com",
        password: "hash",
        role: UserRole.USER,
      }),
      getUserByEmail: async () => null,
      generateVerificationToken: async (email) => ({
        email,
        token: "verify-token",
      }),
      sendVerificationEmail: async (email, token) => {
        calls.push(`${email}:${token}`);
      },
      comparePassword: async () => true,
      hashPassword: async () => "hashed",
      updateUser: async () => {
        throw new Error("not expected");
      },
    }
  );

  assert.equal(result.success, "Verification email sent!");
  assert.equal(calls[0], "new@example.com:verify-token");
});

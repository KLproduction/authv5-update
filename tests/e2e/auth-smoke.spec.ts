import { expect, test } from "@playwright/test";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { db } from "../../lib/db";

const makeEmail = (prefix: string, workerIndex: number) =>
  `${prefix}-${workerIndex}-${Date.now()}@authkit.local`;

const gotoReady = async (page: import("@playwright/test").Page, path: string) => {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-e2e-ready", "true");
};

test.describe.serial("auth smoke flow", () => {
  test("registers a new account", async ({ page }, testInfo) => {
    const email = makeEmail("register", testInfo.workerIndex);

    await gotoReady(page, "/auth/register");
    await page.getByLabel("Name").fill("Smoke User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: "Create an account" }).click();

    await expect
      .poll(async () => db.user.findUnique({ where: { email } }))
      .not.toBeNull();

    await expect
      .poll(async () => db.verificationToken.findFirst({ where: { email } }))
      .not.toBeNull();
  });

  test("logs in and reaches the setting page", async ({ page }) => {
    await gotoReady(page, "/auth/login?callbackUrl=/setting");
    await page.getByLabel("Email").fill("user@authkit.local");
    await page.getByLabel("Password").fill("User123!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/setting/);
    await expect(page.getByText("Setting")).toBeVisible();
  });

  test("sends a reset password request", async ({ page }) => {
    const email = `user@authkit.local`;
    await gotoReady(page, "/auth/reset");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Send reset email" }).click();

    await expect(page.getByText("Reset mail sent!")).toBeVisible();

    await expect
      .poll(async () => db.passwordResetToken.findFirst({ where: { email } }))
      .not.toBeNull();
  });

  test("completes the 2FA login flow", async ({ page }, testInfo) => {
    const email = makeEmail("2fa", testInfo.workerIndex);
    const password = "Password123!";
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.upsert({
      where: { email },
      update: {
        name: "Two Factor User",
        password: hashedPassword,
        emailVerified: new Date(),
        isTwoFactorEnabled: true,
        role: UserRole.USER,
      },
      create: {
        email,
        name: "Two Factor User",
        password: hashedPassword,
        emailVerified: new Date(),
        isTwoFactorEnabled: true,
        role: UserRole.USER,
      },
    });

    await gotoReady(page, "/auth/login?callbackUrl=/setting");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByLabel("Two Factor Code")).toBeVisible();

    await expect
      .poll(async () => db.twoFactorToken.findFirst({ where: { email } }))
      .not.toBeNull();

    const token = await db.twoFactorToken.findFirst({
      where: { email },
    });

    await page.getByLabel("Two Factor Code").fill(token!.token);
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page).toHaveURL(/\/setting/);
  });

  test("enforces role gate for admin endpoint", async ({ page }) => {
    await gotoReady(page, "/auth/login?callbackUrl=/setting");
    await page.getByLabel("Email").fill("user@authkit.local");
    await page.getByLabel("Password").fill("User123!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/setting/);

    const response = await page.request.get("/api/admin");
    expect(response.status()).toBe(403);
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import { UserRole } from "@prisma/client";
import { adminAccessFlow } from "../lib/auth-domains/admin";

test("adminAccessFlow allows admins only", () => {
  assert.equal(adminAccessFlow(UserRole.ADMIN).success, "Allowed!");
  assert.equal(adminAccessFlow(UserRole.USER).error, "Forbidden!");
  assert.equal(adminAccessFlow(null).error, "Forbidden!");
});

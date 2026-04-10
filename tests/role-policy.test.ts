import test from "node:test";
import assert from "node:assert/strict";
import { UserRole } from "@prisma/client";
import { hasRole, isAdmin, ROLE_POLICY } from "../lib/role-policy";

test("hasRole allows admin within the admin-only policy", () => {
  assert.equal(hasRole(UserRole.ADMIN, ROLE_POLICY.adminOnly), true);
  assert.equal(hasRole(UserRole.USER, ROLE_POLICY.adminOnly), false);
});

test("isAdmin detects admin role only", () => {
  assert.equal(isAdmin(UserRole.ADMIN), true);
  assert.equal(isAdmin(UserRole.USER), false);
  assert.equal(isAdmin(null), false);
});

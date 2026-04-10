"use server";

import { auth } from "@/auth";
import { hasRole, ROLE_POLICY } from "@/lib/role-policy";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireAuthenticatedUser(redirectTo = "/auth/login") {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }

  return session.user;
}

export async function requireRole(
  allowedRoles: readonly UserRole[],
  redirectTo = "/auth/error"
) {
  const user = await requireAuthenticatedUser();

  if (!hasRole(user.role, allowedRoles)) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireAdmin() {
  return requireRole(ROLE_POLICY.adminOnly);
}

export async function canAccessRole(
  allowedRoles: readonly UserRole[]
): Promise<boolean> {
  const session = await auth();
  return hasRole(session?.user?.role, allowedRoles);
}

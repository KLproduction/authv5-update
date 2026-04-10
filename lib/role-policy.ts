import { UserRole } from "@prisma/client";

export const ROLE_POLICY = {
  authenticated: [UserRole.ADMIN, UserRole.USER] as const,
  adminOnly: [UserRole.ADMIN] as const,
} as const;

export function hasRole(
  role: UserRole | undefined | null,
  allowedRoles: readonly UserRole[]
) {
  return role ? allowedRoles.includes(role) : false;
}

export function isAdmin(role: UserRole | undefined | null) {
  return role === UserRole.ADMIN;
}

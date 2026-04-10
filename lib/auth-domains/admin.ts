import { UserRole } from "@prisma/client";

export type AdminAccessResult =
  | { success: "Allowed!" }
  | { error: "Forbidden!" };

export function adminAccessFlow(
  role: UserRole | undefined | null
): AdminAccessResult {
  if (role === UserRole.ADMIN) {
    return { success: "Allowed!" };
  }

  return { error: "Forbidden!" };
}

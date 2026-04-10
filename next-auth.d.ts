import NextAuth, { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

//adding type to session by extending the DefaultSession
export type ExtenderUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  isGuest: boolean;
  guestExpiresAt?: Date | null;
};

declare module "next-auth" {
  interface Session {
    user: ExtenderUser;
  }
}

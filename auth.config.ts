import type { NextAuthConfig } from "next-auth";
import { buildAuthProviders } from "./lib/auth-providers";

export default {
  providers: buildAuthProviders(),
} satisfies NextAuthConfig;

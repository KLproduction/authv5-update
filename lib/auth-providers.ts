import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { authProviders } from "@/lib/env";

export function buildAuthProviders(): NextAuthConfig["providers"] {
  const providers: NextAuthConfig["providers"] = [];

  if (authProviders.github.clientId && authProviders.github.clientSecret) {
    providers.push(
      GitHub({
        clientId: authProviders.github.clientId,
        clientSecret: authProviders.github.clientSecret,
      })
    );
  }

  if (authProviders.google.clientId && authProviders.google.clientSecret) {
    providers.push(
      Google({
        clientId: authProviders.google.clientId,
        clientSecret: authProviders.google.clientSecret,
      })
    );
  }

  providers.push(
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        return passwordMatch ? user : null;
      },
    })
  );

  return providers;
}

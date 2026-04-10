import { z } from "zod";

const envSchema = z
  .object({
    AUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().min(1).optional(),
    AUTH_GOOGLE_SECRET: z.string().min(1).optional(),
    AUTH_GITHUB_ID: z.string().min(1).optional(),
    AUTH_GITHUB_SECRET: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_SERVER_URL: z.string().url().optional(),
    NEXT_PUBLIC_PRODUCTION_URL: z.string().url().optional(),
  })
  .superRefine((env, ctx) => {
    if (!env.AUTH_SECRET && !env.NEXTAUTH_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Set AUTH_SECRET or NEXTAUTH_SECRET.",
        path: ["AUTH_SECRET"],
      });
    }
  });

export const env = envSchema.parse(process.env);

export const authSecret = env.AUTH_SECRET ?? env.NEXTAUTH_SECRET;

export const authProviders = {
  google: {
    clientId: env.AUTH_GOOGLE_ID,
    clientSecret: env.AUTH_GOOGLE_SECRET,
  },
  github: {
    clientId: env.AUTH_GITHUB_ID,
    clientSecret: env.AUTH_GITHUB_SECRET,
  },
  resendApiKey: env.RESEND_API_KEY,
  serverUrl: env.NEXT_PUBLIC_SERVER_URL,
  productionUrl: env.NEXT_PUBLIC_PRODUCTION_URL,
} as const;

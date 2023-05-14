import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    CLERK_SECRET_KEY: z.string(),
    BUCKET_NAME: z.string(),
    REGION: z.string(),
    ACCESS_KEY: z.string(),
    SECRET_ACCESS_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_TARGET_DATE: z.string().datetime().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME,
    REGION: process.env.REGION,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_TARGET_DATE: process.env.NEXT_PUBLIC_TARGET_DATE,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
});

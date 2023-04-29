import { PrismaClient } from "@prisma/client";
import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

import { env } from "../../env/server.mjs";
import type { DB } from "./types.js";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
  }),
});

import { awsRouter } from "./routers/aws";
import { cocktailRouter } from "./routers/cocktail";
import { exampleRouter } from "./routers/example";
import { neonRouter } from "./routers/neon";
import { robotRouter } from "./routers/robot";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  cocktail: cocktailRouter,
  aws: awsRouter,
  robot: robotRouter,
  neon: neonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

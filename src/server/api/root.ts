import { awsRouter } from "@/server/api/routers/aws";
import { cocktailRouter } from "@/server/api/routers/cocktail";
import { exampleRouter } from "@/server/api/routers/example";
import { garnishRouter } from "@/server/api/routers/garnish";
import { iceRouter } from "@/server/api/routers/ice";
import { ingredientRouter } from "@/server/api/routers/ingredient";
import { robotRouter } from "@/server/api/routers/robot";
import { unitRouter } from "@/server/api/routers/unit";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  cocktail: cocktailRouter,
  aws: awsRouter,
  robot: robotRouter,
  unit: unitRouter,
  ingredient: ingredientRouter,
  garnish: garnishRouter,
  ice: iceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

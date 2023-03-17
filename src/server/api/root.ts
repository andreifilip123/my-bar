import { awsRouter } from "./routers/aws";
import { cocktailRouter } from "./routers/cocktail";
import { exampleRouter } from "./routers/example";
import { garnishRouter } from "./routers/garnish";
import { ingredientRouter } from "./routers/ingredient";
import { robotRouter } from "./routers/robot";
import { unitRouter } from "./routers/unit";
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
  unit: unitRouter,
  ingredient: ingredientRouter,
  garnish: garnishRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

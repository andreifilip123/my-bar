import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const ingredientRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => ctx.prisma.ingredient.findMany()),

  byName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.ingredient.findFirst({
        where: {
          name: input.name,
        },
      });
    }),
});

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const garnishRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => ctx.prisma.garnish.findMany()),

  byName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.garnish.findFirst({
        where: {
          name: input.name,
        },
      });
    }),
});

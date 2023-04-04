import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const iceRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => ctx.prisma.ice.findMany()),

  byName: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.ice.findFirst({
        where: {
          type: input.type,
        },
      });
    }),
});

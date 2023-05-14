import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const unitRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => ctx.prisma.unit.findMany()),

  byName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.unit.findFirst({
        where: {
          name: input.name,
        },
      });
    }),
});

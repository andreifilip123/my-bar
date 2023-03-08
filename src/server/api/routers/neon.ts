import { createTRPCRouter, publicProcedure } from "../trpc";

export const neonRouter = createTRPCRouter({
  wakeUpDatabase: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.$connect();
  }),
});

import z from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const cocktailRouter = createTRPCRouter({
  all: publicProcedure
    .query(({ ctx }) => ctx.prisma.cocktail.findMany()),

  byName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => ctx.prisma.cocktail.findFirstOrThrow({
      where: {
        name: input.name,
      },
    })),

  createCocktail: protectedProcedure
    .input(z.object({
      name: z.string(),
      ingredients: z.array(z.object({
        name: z.string(),
        amount: z.number(),
        unit: z.object({
          name: z.string(),
        }),
      })),
    }))
    .mutation(({ ctx, input }) => ctx.prisma.cocktail.create({
      data: {
        name: input.name,
        ingredients: {
          connectOrCreate: input.ingredients.map((ingredient) => ({
            where: {
              name: ingredient.name,
            },
            create: {
              name: ingredient.name,
              amount: ingredient.amount,
              unit: {
                connectOrCreate: {
                  where: {
                    name: ingredient.unit.name,
                  },
                  create: {
                    name: ingredient.unit.name,
                  },
                },
              },
            },
          })),
        }
      },
    })),

  deleteCocktail: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cocktail = await ctx.prisma.cocktail.findFirstOrThrow({
        where: {
          name: input.name,
        },
      });

      if (!cocktail) {
        throw new Error("Cocktail not found");
      }

      return ctx.prisma.cocktail.delete({
        where: {
          id: cocktail.id,
        },
      });
    }),
});
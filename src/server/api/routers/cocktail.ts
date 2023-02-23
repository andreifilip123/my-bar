import z from "zod";
import { parsedCocktailRecipe } from "../../../types/ParsedCocktailRecipe";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const cocktailRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) =>
    ctx.prisma.cocktail.findMany({
      include: {
        ingredients: {
          include: {
            unit: true,
          },
        },
      },
    }),
  ),

  byName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.cocktail.findFirstOrThrow({
        where: {
          name: input.name,
        },
      }),
    ),

  create: protectedProcedure
    .input(
      parsedCocktailRecipe // zod schema
        .extend({
          imageId: z.string(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
      // create units
      await Promise.all(
        input.ingredients.map(async (ingredient) => {
          await ctx.prisma.unit.create({
            data: {
              name: ingredient.unit,
            },
          });
        }),
      );
      // create ingredients
      await Promise.all(
        input.ingredients.map(async (ingredient) => {
          await ctx.prisma.ingredient.create({
            data: {
              name: ingredient.ingredient,
              amount: ingredient.amount,
              unit: {
                connect: {
                  name: ingredient.unit,
                },
              },
            },
          });
        }),
      );
      // create garnishes
      await Promise.all(
        input.garnishes.map(async (garnish) => {
          await ctx.prisma.garnish.create({
            data: {
              name: garnish.ingredient,
              amount: garnish.amount,
              unit: garnish.unit,
            },
          });
        }),
      );
      // create ice
      await ctx.prisma.ice.create({
        data: {
          type: input.ice.type,
        },
      });
      // create cocktail
      await ctx.prisma.cocktail.create({
        data: {
          name: input.name,
          image: {
            connect: {
              id: input.imageId,
            },
          },
          ingredients: {
            connect: input.ingredients.map((ingredient) => ({
              name: ingredient.ingredient,
            })),
          },
          garnishes: {
            connect: input.garnishes.map((garnish) => ({
              name: garnish.ingredient,
            })),
          },
          ice: {
            connect: {
              type: input.ice.type,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
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

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.cocktail.deleteMany();
  }),
});

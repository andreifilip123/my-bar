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
      // create units if they don't exist
      await Promise.all(
        input.ingredients.map(async (ingredient) => {
          await ctx.prisma.unit.upsert({
            where: {
              name: ingredient.unit,
            },
            create: {
              name: ingredient.unit,
            },
            update: {},
          });
        }),
      );
      // create ingredients
      await Promise.all(
        input.ingredients.map(async (ingredient) => {
          await ctx.prisma.ingredient.upsert({
            where: {
              name: ingredient.ingredient,
            },
            create: {
              name: ingredient.ingredient,
              amount: ingredient.amount,
              unit: {
                connect: {
                  name: ingredient.unit,
                },
              },
            },
            update: {},
          });
        }),
      );
      // create garnishes
      await Promise.all(
        input.garnishes.map(async (garnish) => {
          await ctx.prisma.garnish.upsert({
            where: {
              name: garnish.ingredient,
            },
            create: {
              name: garnish.ingredient,
              amount: garnish.amount,
              unit: garnish.unit,
            },
            update: {},
          });
        }),
      );
      // create ice
      await ctx.prisma.ice.upsert({
        where: {
          type: input.ice.type,
        },
        create: {
          type: input.ice.type,
        },
        update: {},
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

  getCocktailOfTheWeek: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const cocktailOfTheWeek = await ctx.prisma.cocktail.findFirst({
        where: {
          isCocktailOfTheWeek: true,
        },
        include: {
          ingredients: {
            include: {
              unit: true,
            },
          },
        },
      });

      if (!cocktailOfTheWeek) {
        throw new Error("No cocktail of the week found");
      }

      return cocktailOfTheWeek;
    }),

  setCocktailOfTheWeek: protectedProcedure
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

      await ctx.prisma.cocktail.updateMany({
        where: {
          isCocktailOfTheWeek: true,
        },
        data: {
          isCocktailOfTheWeek: false,
        },
      });

      return ctx.prisma.cocktail.update({
        where: {
          id: cocktail.id,
        },
        data: {
          isCocktailOfTheWeek: true,
        },
      });
    }),
});

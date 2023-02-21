import z from "zod";

export const parsedCocktailRecipe = z.object({
  name: z.string(),
  ingredients: z.array(
    z.object({
      amount: z.number(),
      unit: z.string(),
      ingredient: z.string(),
    }),
  ),
  garnishes: z.array(
    z.object({
      amount: z.number(),
      unit: z.string(),
      ingredient: z.string(),
    }),
  ),
  ice: z.object({ type: z.string() }),
});

export type ParsedCocktailRecipe = z.infer<typeof parsedCocktailRecipe>;

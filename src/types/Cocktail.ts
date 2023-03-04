import type { Prisma } from "@prisma/client";

export type Ingredient = Prisma.IngredientGetPayload<{
  include: { unit: true };
}>;

export type CocktailWithIngredients = Prisma.CocktailGetPayload<{
  include: {
    ingredients: {
      include: { unit: true };
    };
  };
}>;

import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Cocktail = {
  id: string;
  name: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  imageId: string;
  userId: string | null;
  isCocktailOfTheWeek: Generated<number>;
  iceId: string;
};
export type CocktailToGarnish = {
  A: string;
  B: string;
};
export type CocktailToIngredient = {
  A: string;
  B: string;
};
export type Garnish = {
  id: string;
  name: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  amount: number;
  unitId: string;
};
export type Ice = {
  id: string;
  type: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type Image = {
  id: string;
  userId: string | null;
};
export type Ingredient = {
  id: string;
  name: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  amount: number;
  unitId: string;
};
export type Unit = {
  id: string;
  name: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type DB = {
  Cocktail: Cocktail;
  _CocktailToGarnish: CocktailToGarnish;
  _CocktailToIngredient: CocktailToIngredient;
  Garnish: Garnish;
  Ice: Ice;
  Image: Image;
  Ingredient: Ingredient;
  Unit: Unit;
};

import React from "react";

import type { ParsedCocktailRecipe } from "../types/ParsedCocktailRecipe";

export type RobotStep = "searchCocktail" | "uploadImage" | "submitCocktail";

export interface RobotContextFields {
  currentStep: RobotStep;
  setCurrentStep: React.Dispatch<React.SetStateAction<RobotStep>>;
  image: string | undefined;
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  cocktailRecipe: ParsedCocktailRecipe | undefined;
  setCocktailRecipe: React.Dispatch<
    React.SetStateAction<ParsedCocktailRecipe | undefined>
  >;
}

export const RobotContext = React.createContext<RobotContextFields>(
  {} as RobotContextFields,
);

export const useRobotContext = (): RobotContextFields => {
  const context = React.useContext(RobotContext);

  if (!context)
    throw new Error(
      "useRobotContext must be used within a RobotContextProvider",
    );

  return context;
};

import { Button, Flex, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRobotContext } from "../../../../contexts/useRobotContext";
import RobotCocktailCard from "../RobotCocktailCard";

import { api } from "../../../../utils/api";

const SubmitCocktail: NextPage = () => {
  const { cocktailRecipe, image } = useRobotContext();

  const createCocktail = api.cocktail.create.useMutation();

  const onSubmit = async () => {
    if (!image || !cocktailRecipe) return;
    try {
      await createCocktail.mutateAsync({
        ...cocktailRecipe,
        imageId: image,
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (!cocktailRecipe) return null;

  return (
    <Flex>
      <RobotCocktailCard recipe={cocktailRecipe} image={image} />
      <Heading>If this looks good, submit it!</Heading>
      <Button onClick={() => onSubmit()}>Submit</Button>
    </Flex>
  );
};

export default SubmitCocktail;

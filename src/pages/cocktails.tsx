import { HStack } from "@chakra-ui/react";
import CocktailCard from "../components/CocktailCard";
import { api } from "../utils/api";

const Cocktails = () => {
  const cocktails = api.cocktail.all.useQuery(undefined, {});

  return (
    <HStack>
      {cocktails.data?.map((cocktail) => (
        <CocktailCard key={cocktail.id} {...cocktail} />
      ))}
    </HStack>
  );
};

export default Cocktails;

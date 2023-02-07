import { AspectRatio, Box, Flex, Image } from "@chakra-ui/react";
import type { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";

import styles from "./CocktailCard.module.css";

type Ingredient = Prisma.IngredientGetPayload<{
  include: { unit: true };
}>;

type CocktailWithIngredients = Prisma.CocktailGetPayload<{
  include: {
    ingredients: {
      include: { unit: true };
    };
  };
}>;

const CocktailCard = (cocktail: CocktailWithIngredients) => {
  const { data: imageUrl } = api.aws.getSignedUrl.useQuery(
    { imageKey: cocktail.imageId },
    {},
  );
  const [showDetails, setShowDetails] = useState<boolean>();
  const [isHovering, setIsHovering] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (isHovering) {
      const id = setTimeout(function () {
        setShowDetails(true);
      }, 1000);
      setTimeoutId(id);
    }
    return () => {
      clearTimeout(timeoutId);
    };
    // Disabled this rule because it's causing an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);

  const handleMouseLeave = () => {
    setIsHovering(false);
    clearTimeout(timeoutId);
  };

  const ingredientMapper = (ingredient: Ingredient) =>
    `${ingredient.amount} ${ingredient.unit.name} of ${ingredient.name}`;

  return (
    <AspectRatio
      maxW={300}
      ratio={14 / 16}
      width="100%"
      position="relative"
      margin={3}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        setShowDetails(!showDetails);
        clearTimeout(timeoutId);
      }}
    >
      <>
        <Image src={imageUrl} alt={cocktail.name} borderRadius={20} />
        <Flex
          justifyContent="center"
          // required because AspectRatio has higher specificity (.css-11lbcxa>*:not(style))
          style={{
            alignItems: "flex-end",
          }}
          textAlign="center"
          position="absolute"
          top="0"
          bottom="0"
          left="0"
          right="0"
          borderRadius={20}
          bgGradient="linear(to-br, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))"
        >
          <Flex
            direction="column"
            alignItems="center"
            pb={5}
            className={
              showDetails === undefined
                ? "translate-y-1/2"
                : showDetails
                ? styles["content-active"]
                : styles["content-inactive"]
            }
          >
            <Box fontWeight="bold" color="white">
              {cocktail.name}
            </Box>

            <Box
              fontWeight="bold"
              color="white"
              className={
                showDetails === undefined
                  ? "opacity-0"
                  : showDetails
                  ? styles["details-active"]
                  : styles["details-inactive"]
              }
            >
              {cocktail.ingredients.map(ingredientMapper).join(", ")}
            </Box>
          </Flex>
        </Flex>
      </>
    </AspectRatio>
  );
};

export default CocktailCard;

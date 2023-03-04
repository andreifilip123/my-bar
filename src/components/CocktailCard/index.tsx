import { AspectRatio, Box, Flex, Image, useDisclosure } from "@chakra-ui/react";
import type { CocktailWithIngredients } from "../../types/Cocktail";
import { api } from "../../utils/api";
import CocktailModal from "../CocktailModal";

const CocktailCard = (cocktail: CocktailWithIngredients) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: imageUrl } = api.aws.getSignedUrl.useQuery(
    { imageKey: cocktail.imageId },
    {},
  );

  return (
    <>
      <AspectRatio
        maxW={300}
        ratio={14 / 16}
        width="100%"
        position="relative"
        margin={3}
        onClick={onOpen}
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
            <Flex direction="column" alignItems="center" pb={5}>
              <Box fontWeight="bold" color="white">
                {cocktail.name}
              </Box>
            </Flex>
          </Flex>
        </>
      </AspectRatio>
      <CocktailModal
        isOpen={isOpen}
        onClose={onClose}
        cocktail={cocktail}
        imageUrl={imageUrl}
      />
    </>
  );
};

export default CocktailCard;

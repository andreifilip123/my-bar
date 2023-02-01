import { AspectRatio, Flex, Image, Text } from "@chakra-ui/react";
import type { Cocktail } from "@prisma/client";
import { api } from "../utils/api";

const CocktailCard = (cocktail: Cocktail) => {
  const { data: imageUrl } = api.aws.getSignedUrl.useQuery(
    { imageKey: cocktail.imageId },
    {},
  );

  return (
    <AspectRatio
      maxW={300}
      ratio={14 / 16}
      width="100%"
      position="relative"
      margin={3}
    >
      <>
        <Image src={imageUrl} alt={cocktail.name} borderRadius={20} />
        <Flex
          justifyContent="center"
          position="absolute"
          top="0"
          bottom="0"
          left="0"
          right="0"
          borderRadius={20}
          bgGradient="linear(to-br, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))"
        >
          <Text pb="5" fontWeight="bold" color="white" alignSelf="flex-end">
            {cocktail.name}
          </Text>
        </Flex>
      </>
    </AspectRatio>
  );
};

export default CocktailCard;

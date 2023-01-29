import { Card, CardBody, CardFooter, Image } from "@chakra-ui/react";
import type { Cocktail } from "@prisma/client";
import { api } from "../utils/api";

const CocktailCard = (cocktail: Cocktail) => {
  const { data: imageUrl } = api.aws.getSignedUrl.useQuery(
    { imageKey: cocktail.imageId },
    {},
  );

  return (
    <Card maxW={300} key={cocktail.id}>
      <CardBody>
        <Image src={imageUrl} alt={cocktail.name} />
      </CardBody>
      <CardFooter>
        <h1>{cocktail.name}</h1>
      </CardFooter>
    </Card>
  );
};

export default CocktailCard;

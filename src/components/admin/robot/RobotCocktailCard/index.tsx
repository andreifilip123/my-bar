import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  ListItem,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { FC } from "react";
import type { ParsedCocktailRecipe } from "../../../../types/ParsedCocktailRecipe";
import { api } from "../../../../utils/api";

const RobotCocktailCard: FC<{
  recipe: ParsedCocktailRecipe;
  onSelect?: () => void;
  image?: string;
}> = ({ recipe, onSelect, image }) => {
  const { data: imageUrl } = api.aws.getSignedUrl.useQuery(
    { imageKey: image ?? "" },
    {
      enabled: !!image,
    },
  );

  return (
    <Card width={350} maxW="100%">
      {image && imageUrl && (
        <Image src={imageUrl} alt={`Image of ${recipe.name}`} />
      )}
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Ingredients
            </Heading>
            <UnorderedList>
              {recipe.ingredients.map((ingredient) => (
                <ListItem key={ingredient.ingredient}>
                  {ingredient.amount} {ingredient.unit} {ingredient.ingredient}
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Garnishes
            </Heading>
            <UnorderedList>
              {recipe.garnishes.map((garnish) => (
                <ListItem key={garnish.ingredient}>
                  {garnish.amount} {garnish.unit} {garnish.ingredient}
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Type of ice
            </Heading>
            <Text pt="2" fontSize="sm">
              {recipe.ice.type}
            </Text>
          </Box>
        </Stack>
      </CardBody>
      {onSelect && (
        <CardFooter>
          <Button
            mt="4"
            width="100%"
            bgColor="green.500"
            color="white"
            onClick={onSelect}
          >
            Select
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RobotCocktailCard;

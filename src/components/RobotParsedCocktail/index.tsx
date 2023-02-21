import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  ListItem,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { FC } from "react";
import type { ParsedCocktailRecipe } from "../../types/ParsedCocktailRecipe";

const index: FC<{ recipe: ParsedCocktailRecipe; onSelect?: () => void }> = ({
  recipe,
  onSelect,
}) => {
  return (
    <Card width={350} maxW="100%">
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

export default index;

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  ListItem,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { FC } from "react";
import type { ParsedCocktailRecipe } from "../../pages/admin/robot";

const index: FC<{ recipe: ParsedCocktailRecipe }> = ({ recipe }) => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">{recipe.name}</Heading>
      </CardHeader>

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
    </Card>
  );
};

export default index;

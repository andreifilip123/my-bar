import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import type { FC } from "react";
import type { CocktailWithIngredients, Ingredient } from "../../types/Cocktail";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cocktail: CocktailWithIngredients;
  imageUrl: string | undefined;
}

const CocktailModal: FC<Props> = ({ isOpen, onClose, cocktail, imageUrl }) => {
  const ingredientMapper = (ingredient: Ingredient) =>
    `${ingredient.amount} ${ingredient.unit.name} of ${ingredient.name}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius={10}>
        <ModalCloseButton />

        <ModalBody p={10}>
          <AspectRatio width="100%" ratio={3 / 4}>
            <Image
              src={imageUrl}
              alt={cocktail.name}
              objectFit="cover"
              borderRadius={20}
            />
          </AspectRatio>
          <Flex
            marginTop={5}
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            gap={5}
          >
            <Heading as="h3" size="md">
              {cocktail.name}
            </Heading>
            <Text>{cocktail.ingredients.map(ingredientMapper).join(", ")}</Text>
          </Flex>
        </ModalBody>

        <ModalFooter display="none">
          <Button colorScheme="blue" mr={3}>
            Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CocktailModal;

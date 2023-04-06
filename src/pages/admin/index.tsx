import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import CreateCocktailForm from "../../components/admin/CreateCocktailForm";

import { api } from "../../utils/api";

const Admin: NextPage = () => {
  const { data: cocktails, refetch } = api.cocktail.all.useQuery(undefined, {});
  const deleteCocktail = api.cocktail.delete.useMutation();
  const setCocktailOfTheWeek = api.cocktail.setCocktailOfTheWeek.useMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Center p={10}>
      <Box w="800px" maxW="100%" alignContent="center" justifyContent="center">
        <Flex justifyContent="space-between">
          <Heading as="h1">Existing cocktails:</Heading>
          <Button onClick={onOpen}>+</Button>
        </Flex>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Cocktail name</Th>
                <Th>Ingredients</Th>
                <Th>Cocktail of the week</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cocktails?.map((cocktail) => (
                <Tr key={cocktail.id}>
                  <Td>{cocktail.name}</Td>
                  <Td>
                    {cocktail.ingredients.map((ingredient) => (
                      <div key={ingredient.id}>
                        {ingredient.amount} {ingredient.unit.name}{" "}
                        {ingredient.name}
                      </div>
                    ))}
                  </Td>
                  <Td>
                    <Tooltip label="Set as cocktail of the week">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setCocktailOfTheWeek.mutateAsync(
                            { name: cocktail.name },
                            { onSuccess: async () => await refetch() },
                          )
                        }
                      >
                        🌟
                      </Button>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip label="Delete cocktail">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          deleteCocktail.mutateAsync(
                            { name: cocktail.name },
                            { onSuccess: async () => await refetch() },
                          )
                        }
                      >
                        🗑️
                      </Button>
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new cocktail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateCocktailForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center>
  );
};

export default Admin;

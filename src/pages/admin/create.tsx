import { Center, Heading } from "@chakra-ui/react";

import CreateCocktailForm from "@/components/admin/CreateCocktailForm";

const Create = () => {
  return (
    <Center width="100vw" height="100vh" flexDir="column">
      <Heading as="h1" my={6}>
        Create a new cocktail
      </Heading>

      <CreateCocktailForm />
    </Center>
  );
};

export default Create;

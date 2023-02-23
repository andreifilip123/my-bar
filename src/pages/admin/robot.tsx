import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Progress,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import JSON5 from "json5";
import type { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import RobotParsedCocktail from "../../components/RobotParsedCocktail";
import type { ParsedCocktailRecipe } from "../../types/ParsedCocktailRecipe";
import { parsedCocktailRecipe } from "../../types/ParsedCocktailRecipe";

import { api } from "../../utils/api";

const formSchema = z.object({
  cocktailName: z.string(),
  numberOfVariants: z.number(),
});

type IFormInputs = z.infer<typeof formSchema>;

const Robot: NextPage = () => {
  const { data: robotIsAlive, isLoading } = api.robot.isAlive.useQuery();
  const getCocktailRecipe = api.robot.getCocktailRecipe.useMutation();

  const [results, setResults] = useState<ParsedCocktailRecipe[]>([]);
  const [selectedResult, setSelectedResult] = useState<ParsedCocktailRecipe>();

  const { register, handleSubmit } = useForm<IFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfVariants: 3,
    },
  });

  const onSubmit = async (data: IFormInputs) => {
    const versions = await Promise.all(
      Array.from({ length: data.numberOfVariants }, () =>
        getCocktailRecipe.mutateAsync({ cocktailName: data.cocktailName }),
      ),
    );

    const parsedVersions = versions
      .filter((version) => {
        try {
          return parsedCocktailRecipe.parse(JSON5.parse(version));
        } catch (error) {
          console.log(version);
          console.log(error);
        }
      })
      .map((version) => parsedCocktailRecipe.parse(JSON5.parse(version)));

    setResults(parsedVersions);
  };

  const createCocktailMutation = api.cocktail.create.useMutation();

  const createCocktail = async (recipe: ParsedCocktailRecipe) => {
    await createCocktailMutation.mutateAsync({
      ...recipe,
      imageId: "cocktail-1",
    });
  };

  if (isLoading)
    return (
      <Center minH="100vh" flexDir="column">
        <Progress size="lg" isIndeterminate width="30%" borderRadius="10" />
        <Heading>Loading...</Heading>
      </Center>
    );

  if (!robotIsAlive)
    return (
      <Center minH="100vh">
        <Heading>
          Currently, the <Link href="ai.com">🤖</Link> is not available
        </Heading>
      </Center>
    );

  return (
    <Center flexDir="column" minH="100vh">
      <Heading as="h1">
        Create a cocktail with the help of the <Link href="ai.com">🤖</Link>
      </Heading>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HStack>
            <Input placeholder="Cocktail name" {...register("cocktailName")} />

            <FormLabel flexBasis={250}>Number of variants:</FormLabel>
            <Input
              placeholder="Number of variants"
              type="number"
              flexBasis={50}
              {...register("numberOfVariants", { valueAsNumber: true })}
            />
          </HStack>

          <Input type="submit" />
        </form>
      </Box>

      {results.length && !selectedResult ? (
        <Flex gap="4" mt={10} flexWrap="wrap">
          {results.map((result, index) => (
            <RobotParsedCocktail
              key={index}
              recipe={result}
              onSelect={() => setSelectedResult(result)}
            />
          ))}
        </Flex>
      ) : null}

      {selectedResult ? (
        <>
          <RobotParsedCocktail recipe={selectedResult} />
          <Button onClick={() => setSelectedResult(undefined)}>Back</Button>
          <Button onClick={() => createCocktail(selectedResult)}>Save</Button>
        </>
      ) : null}
    </Center>
  );
};

export default Robot;

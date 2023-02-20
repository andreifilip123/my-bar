import { Box, Center, Flex, Heading, Input } from "@chakra-ui/react";
import JSON5 from "json5";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import z from "zod";
import RobotParsedCocktail from "../../components/RobotParsedCocktail";

import { api } from "../../utils/api";

const parsedCocktailRecipe = z.object({
  name: z.string(),
  ingredients: z.array(
    z.object({
      amount: z.number(),
      unit: z.string(),
      ingredient: z.string(),
    }),
  ),
  garnishes: z.array(
    z.object({
      amount: z.number(),
      unit: z.string(),
      ingredient: z.string(),
    }),
  ),
  ice: z.object({ type: z.string() }),
});

export type ParsedCocktailRecipe = z.infer<typeof parsedCocktailRecipe>;

const Robot: NextPage = () => {
  const [cocktailName, setCocktailName] = useState("");
  const getCocktailRecipe = api.robot.getCocktailRecipe.useMutation();

  const [results, setResults] = useState<ParsedCocktailRecipe[]>([]);

  const getTopThreeCocktails = async () => {
    const versions = await Promise.all([
      getCocktailRecipe.mutateAsync({ cocktailName }),
      getCocktailRecipe.mutateAsync({ cocktailName }),
      getCocktailRecipe.mutateAsync({ cocktailName }),
    ]);

    try {
      const parsedVersions = versions.map((version) =>
        parsedCocktailRecipe.parse(JSON5.parse(version)),
      );

      setResults(parsedVersions);
    } catch (error) {
      console.log(error);

      setResults([]);
    }
  };

  return (
    <Center flexDir="column" minH="100vh">
      <Heading as="h1">
        Create a cocktail with the help of the <Link href="ai.com">🤖</Link>
      </Heading>

      <Box>
        <Input
          placeholder="Cocktail name"
          onChange={(e) => setCocktailName(e.target.value)}
          value={cocktailName}
        />

        <Input type="submit" onClick={() => getTopThreeCocktails()} />
      </Box>

      {results.length ? (
        <Flex gap="4" mt={10}>
          {results.map((result, index) => (
            <RobotParsedCocktail key={index} recipe={result} />
          ))}
        </Flex>
      ) : null}
    </Center>
  );
};

export default Robot;

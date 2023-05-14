import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import JSON5 from "json5";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import RobotCocktailCard from "@/components/admin/robot/RobotCocktailCard";
import { useRobotContext } from "@/contexts/useRobotContext";
import type { ParsedCocktailRecipe } from "@/types/ParsedCocktailRecipe";
import { parsedCocktailRecipe } from "@/types/ParsedCocktailRecipe";
import { api } from "@/utils/api";

const formSchema = z.object({
  cocktailName: z.string(),
  numberOfVariants: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

const SearchCocktail = () => {
  const { setCurrentStep, setCocktailRecipe } = useRobotContext();
  const getCocktailRecipe = api.robot.getCocktailRecipe.useMutation();

  const [results, setResults] = useState<ParsedCocktailRecipe[]>([]);
  const [selectedResult, setSelectedResult] = useState<ParsedCocktailRecipe>();

  const { register, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfVariants: 3,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    const versions = await Promise.all(
      Array.from({ length: data.numberOfVariants }, () =>
        getCocktailRecipe.mutateAsync({ cocktailName: data.cocktailName }),
      ),
    );

    const parsedVersions = versions
      .filter((version) => {
        try {
          if (!version) return false;
          return parsedCocktailRecipe.parse(JSON5.parse(version));
        } catch (error) {
          console.log(version);
          console.log(error);
        }
      })
      .map((version) => parsedCocktailRecipe.parse(JSON5.parse(version)));

    setResults(parsedVersions);
  };

  return (
    <Center flexDir="column">
      <Box margin={5}>
        <form onSubmit={void handleSubmit(onSubmit)}>
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
            <RobotCocktailCard
              key={index}
              recipe={result}
              onSelect={() => setSelectedResult(result)}
            />
          ))}
        </Flex>
      ) : null}

      {selectedResult ? (
        <>
          <RobotCocktailCard recipe={selectedResult} />
          <Flex gap={5} margin={5}>
            <Button onClick={() => setSelectedResult(undefined)}>Back</Button>
            <Button
              onClick={() => {
                setCocktailRecipe(selectedResult);
                setCurrentStep("uploadImage");
              }}
            >
              Next step
            </Button>
          </Flex>
        </>
      ) : null}
    </Center>
  );
};

export default SearchCocktail;

import { Box, Center, Flex, Heading, Link, Progress } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";

import SearchCocktail from "@/components/admin/robot/SearchCocktail";
import SubmitCocktail from "@/components/admin/robot/SubmitCocktail";
import UploadImage from "@/components/admin/robot/UploadImage";
import type { RobotStep } from "@/contexts/useRobotContext";
import { RobotContext } from "@/contexts/useRobotContext";
import type { ParsedCocktailRecipe } from "@/types/ParsedCocktailRecipe";
import { api } from "@/utils/api";

const Robot: NextPage = () => {
  const { data: robotIsAlive, isLoading } = api.robot.isAlive.useQuery();

  const [currentStep, setCurrentStep] = useState<RobotStep>("searchCocktail");
  const [image, setImage] = useState<string>();
  const [cocktailRecipe, setCocktailRecipe] = useState<ParsedCocktailRecipe>();

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
        Check for updates on{" "}
        <Link href="https://status.openai.com/history" isExternal>
          OpenAI status
        </Link>
      </Center>
    );

  return (
    <Box>
      <Heading as="h1" textAlign="center" padding="10">
        Create a cocktail with the help of the <Link href="ai.com">🤖</Link>
      </Heading>

      <Flex mx="auto" maxW="750px">
        <RobotContext.Provider
          value={{
            currentStep,
            setCurrentStep,
            image,
            setImage,
            cocktailRecipe,
            setCocktailRecipe,
          }}
        >
          <Center flex="1">
            {currentStep === "searchCocktail" && <SearchCocktail />}
            {currentStep === "uploadImage" && <UploadImage />}
            {currentStep === "submitCocktail" && <SubmitCocktail />}
          </Center>
        </RobotContext.Provider>
      </Flex>
    </Box>
  );
};

export default Robot;

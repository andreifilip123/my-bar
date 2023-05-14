/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { env } from "@/env.mjs";
import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const robotRouter = createTRPCRouter({
  isAlive: publicProcedure.query(async () => {
    try {
      const completion = await openai.createCompletion({
        max_tokens: 100,
        prompt: "Hello world",
        model: "text-davinci-003",
        temperature: 0.5,
      });

      return !!completion.data.choices[0]?.text;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status, error.response.data);
      } else {
        console.log(error.message);
      }

      return false;
    }
  }),
  getCocktailRecipe: publicProcedure
    .input(z.object({ cocktailName: z.string() }))
    .mutation(async ({ input }) => {
      if (!input.cocktailName) return "";

      try {
        const questions = [
          `I want to make a ${input.cocktailName} cocktail. Give me the recipe for it.`,
          "Please include the ingredients, the garnish (if any), the type of ice used (if any)",
          "The recipe should be in the following format:",
          "{",
          `  "name": "{string}",`,
          `  "ingredients": [`,
          `    { "amount": {number}, "unit": "{string}", "ingredient": "{string}" },`,
          `  ],`,
          `  "garnishes": [`,
          `    { "amount": {number}, "unit": "{string}", "ingredient": "{string}" },`,
          `  ],`,
          `  "ice": { "type": "{name}" },`,
          "}",
          "The amount should be a number.",
          "The unit should be a string.",
          "The ingredient should be a string.",
          "The ice type should be a string.",
          "The response should be a valid JSON5 object.",
          "All strings should be in lowercase and wrapped in double quotes.",
        ];

        const completion = await openai.createCompletion({
          max_tokens: 3500,
          prompt: questions.join("\n"),
          model: "text-davinci-003",
          temperature: 0.5,
        });

        if (!completion.data.choices[0]?.text) {
          console.log("No completion found", completion.data);
          return "";
        }

        return completion.data.choices[0].text;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response) {
          console.log(error.response.status, error.response.data);
        } else {
          console.log(error.message);
        }

        return "";
      }
    }),
});

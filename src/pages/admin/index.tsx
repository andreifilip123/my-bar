import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PresignedPost } from "aws-sdk/clients/s3";
import type { NextPage } from "next";
import { Fragment } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Creatable from "react-select/creatable";
import z from "zod";

import { api } from "../../utils/api";

interface IFormInputs {
  name: string;
  image: FileList;
  ingredients: Array<{
    amount: number;
    unit: { value: string; label: string };
    name: { value: string; label: string };
  }>;
  garnishes: Array<{
    amount: number;
    unit: { value: string; label: string };
    name: { value: string; label: string };
  }>;
  ice: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string(),
  image: z
    .any()
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      `File size should be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    )
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
  ingredients: z.array(
    z.object({
      amount: z.number().min(0, { message: "Amount should be positive" }),
      unit: z.object({ value: z.string(), label: z.string() }),
      name: z.string().min(1, {
        message: "Ingredient name must be at least 1 character long",
      }),
    }),
  ),
  garnishes: z.array(
    z.object({
      amount: z.number().min(0, { message: "Amount should be positive" }),
      unit: z
        .string()
        .min(1, { message: "Unit must be at least 1 character long" }),
      name: z.string().min(1, {
        message: "Ingredient name must be at least 1 character long",
      }),
    }),
  ),
  ice: z.string(),
});

const Admin: NextPage = () => {
  const { data: cocktails, refetch } = api.cocktail.all.useQuery(undefined, {});
  const { data: units } = api.unit.all.useQuery(undefined, {});
  const unitOptions =
    units?.map((unit) => ({
      value: unit.id,
      label: unit.name,
    })) || [];
  const { data: ingredients } = api.ingredient.all.useQuery(undefined, {});
  const ingredientOptions = ingredients?.map((ingredient) => ({
    value: ingredient.id,
    label: ingredient.name,
  }));
  const { data: garnishes } = api.garnish.all.useQuery(undefined, {});
  const garnishOptions = garnishes?.map((garnish) => ({
    value: garnish.id,
    label: garnish.name,
  }));

  const createCocktail = api.cocktail.create.useMutation();
  const deleteCocktail = api.cocktail.delete.useMutation();
  const setCocktailOfTheWeek = api.cocktail.setCocktailOfTheWeek.useMutation();
  const createPresignedUrl = api.aws.createPresignedUrl.useMutation();

  const { register, handleSubmit, control, formState, reset } =
    useForm<IFormInputs>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        ingredients: [{ amount: 0, unit: undefined, name: undefined }],
        garnishes: [{ amount: 0, unit: undefined, name: undefined }],
      },
    });
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    replace: replaceIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
    rules: {
      minLength: 1,
    },
  });
  const {
    fields: garnishFields,
    append: appendGarnish,
    remove: removeGarnish,
    replace: replaceGarnish,
  } = useFieldArray({
    control,
    name: "garnishes",
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data: IFormInputs) => {
    if (!data.image[0]) return;

    try {
      const presigned = (await createPresignedUrl.mutateAsync({
        fileName: data.image[0]?.name,
        fileType: data.image[0]?.type,
      })) as PresignedPost;
      const { url, fields } = presigned;

      const imageKey = fields.key as string;

      const formData = new FormData();

      Object.entries({ ...fields, file: data.image[0] }).forEach(
        ([key, value]) => {
          formData.append(key, value as string | Blob);
        },
      );

      await fetch(url, {
        method: "POST",
        body: formData,
      });

      await createCocktail.mutateAsync(
        {
          name: data.name,
          imageId: imageKey,
          ingredients: data.ingredients.map((ingredient) => ({
            amount: ingredient.amount,
            unit: ingredient.unit.label,
            ingredient: ingredient.name.label,
          })),
          garnishes: data.garnishes.map((garnish) => ({
            amount: garnish.amount,
            unit: garnish.unit.label,
            ingredient: garnish.name.label,
          })),
          ice: { type: data.ice },
        },
        {
          onSuccess: async () => {
            await refetch();
            reset();
          },
        },
      );

      replaceIngredient([
        {
          amount: 0,
          unit: { value: "", label: "" },
          name: { value: "", label: "" },
        },
      ]);
      replaceGarnish([
        {
          amount: 0,
          unit: { value: "", label: "" },
          name: { value: "", label: "" },
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Center>
      <Box maxW="600px" alignContent="center" justifyContent="center">
        <Heading as="h1">Existing cocktails:</Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Cocktail name</Th>
                <Th>Ingredients</Th>
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
                    <Button
                      onClick={() =>
                        setCocktailOfTheWeek.mutateAsync(
                          { name: cocktail.name },
                          { onSuccess: async () => await refetch() },
                        )
                      }
                    >
                      Mark as cocktail of the week
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      onClick={() =>
                        deleteCocktail.mutateAsync(
                          { name: cocktail.name },
                          { onSuccess: async () => await refetch() },
                        )
                      }
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Create cocktail form */}
        <Heading as="h2">Create a new cocktail:</Heading>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Input placeholder="Cocktail name" {...register("name")} />
          <p className="text-red-600">{formState.errors.name?.message}</p>

          {ingredientFields.map((ingredient, index) => (
            <Fragment key={ingredient.id}>
              <p className="text-red-600">
                {formState.errors.ingredients?.[index]?.amount?.message}
              </p>
              <p className="text-red-600">
                {formState.errors.ingredients?.[index]?.unit?.message}
              </p>
              <p className="text-red-600">
                {formState.errors.ingredients?.[index]?.name?.message}
              </p>
              <SimpleGrid columns={4} key={ingredient.id}>
                <Input
                  placeholder="Amount"
                  type={"number"}
                  {...register(`ingredients.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                />
                <Controller
                  name={`ingredients.${index}.unit`}
                  control={control}
                  render={({ field }) => (
                    <Creatable {...field} options={unitOptions} />
                  )}
                />

                <Controller
                  name={`ingredients.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <Creatable {...field} options={ingredientOptions} />
                  )}
                />

                <Button onClick={() => removeIngredient(index)}>
                  Remove ingredient
                </Button>
              </SimpleGrid>
            </Fragment>
          ))}

          <Button
            m={4}
            onClick={() =>
              appendIngredient({
                name: { label: "", value: "" },
                amount: 0,
                unit: { label: "", value: "" },
              })
            }
          >
            Add ingredient
          </Button>

          {garnishFields.map((garnish, index) => (
            <Fragment key={garnish.id}>
              <p className="text-red-600">
                {formState.errors.garnishes?.[index]?.amount?.message}
              </p>
              <p className="text-red-600">
                {formState.errors.garnishes?.[index]?.unit?.message}
              </p>
              <p className="text-red-600">
                {formState.errors.garnishes?.[index]?.name?.message}
              </p>
              <SimpleGrid columns={4} key={garnish.id}>
                <Input
                  placeholder="Amount"
                  type={"number"}
                  {...register(`garnishes.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                />
                <Controller
                  name={`garnishes.${index}.unit`}
                  control={control}
                  render={({ field }) => (
                    <Creatable {...field} options={unitOptions} />
                  )}
                />

                <Controller
                  name={`garnishes.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <Creatable {...field} options={garnishOptions} />
                  )}
                />

                <Button onClick={() => removeGarnish(index)}>
                  Remove garnish
                </Button>
              </SimpleGrid>
            </Fragment>
          ))}

          <Button
            m={4}
            onClick={() =>
              appendGarnish({
                name: { value: "", label: "" },
                amount: 0,
                unit: { value: "", label: "" },
              })
            }
          >
            Add garnish
          </Button>

          <Input placeholder="Ice" {...register("ice")} />

          <Input type="file" multiple={false} {...register("image")} />

          <Input type="submit" />
        </Box>
      </Box>
    </Center>
  );
};

export default Admin;

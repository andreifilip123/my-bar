import {
  Button,
  Heading,
  Input,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { Fragment } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

import { api } from "../../utils/api";

interface IFormInputs {
  name: string;
  ingredients: Array<{
    amount: number;
    unit: string;
    name: string;
  }>;
}

const formSchema = z.object({
  name: z.string(),
  ingredients: z.array(
    z.object({
      amount: z.number().min(0, { message: "Amount should be positive" }),
      unit: z
        .string()
        .min(1, { message: "Unit must be at least 1 character long" }),
      name: z
        .string()
        .min(1, { message: "Ingredient name must be at least 1 character long" }),
    }),
  ),
});

const Admin: NextPage = () => {
  const cocktails = api.cocktail.all.useQuery(undefined, {});

  const createCocktail = api.cocktail.create.useMutation();
  const deleteCocktail = api.cocktail.delete.useMutation();

  const { register, handleSubmit, control, formState, reset } =
    useForm<IFormInputs>({
      resolver: zodResolver(formSchema),
    });
  const {
    fields: ingredients,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "ingredients",
    rules: {
      minLength: 1,
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data: IFormInputs) => {
    try {
      await createCocktail.mutateAsync(
        {
          name: data.name,
          ingredients: data.ingredients.map((ingredient) => ({
            amount: ingredient.amount,
            unit: {
              name: ingredient.unit,
            },
            name: ingredient.name,
          })),
        },
        {
          onSuccess: async () => {
            await cocktails.refetch();
            reset();
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
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
            {cocktails.data?.map((cocktail) => (
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
                      deleteCocktail.mutateAsync(
                        { name: cocktail.name },
                        { onSuccess: async () => await cocktails.refetch() },
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Cocktail name" {...register("name")} />
        <p className="text-red-600">{formState.errors.name?.message}</p>

        {ingredients.map((field, index) => (
          <Fragment key={field.id}>
            <p className="text-red-600">
              {formState.errors.ingredients?.[index]?.amount?.message}
            </p>
            <p className="text-red-600">
              {formState.errors.ingredients?.[index]?.unit?.message}
            </p>
            <p className="text-red-600">
              {formState.errors.ingredients?.[index]?.name?.message}
            </p>
            <SimpleGrid columns={4} key={field.id}>
              <Input
                placeholder="Amount"
                type={"number"}
                {...register(`ingredients.${index}.amount`, {
                  valueAsNumber: true,
                })}
              />
              <Input
                placeholder="Unit"
                {...register(`ingredients.${index}.unit`)}
              />
              <Input
                placeholder="Ingredient"
                {...register(`ingredients.${index}.name`)}
              />

              <Button onClick={() => remove(index)}>Remove ingredient</Button>
            </SimpleGrid>
          </Fragment>
        ))}

        <Button onClick={() => append({ name: "", amount: 0, unit: "" })}>
          Add ingredient
        </Button>

        <Input type="submit" />
      </form>
    </div>
  );
};

export default Admin;

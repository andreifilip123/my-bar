import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Creatable from "react-select/creatable";
import z from "zod";
import { api } from "../../../utils/api";
import Dropzone from "../Dropzone";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string(),
  image: z
    .custom<FileList>()
    .refine((file) => file?.length == 1, "Image is required.")
    .transform(([file]) => file)
    .refine(
      (file) => file?.size && file?.size <= MAX_FILE_SIZE,
      `Max image size is 10MB.`,
    )
    .refine(
      (file) => file?.type && ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
  ingredients: z.array(
    z.object({
      amount: z.string(),
      unit: z.object({ value: z.string(), label: z.string() }),
      name: z.object({ value: z.string(), label: z.string() }),
    }),
  ),
  garnishes: z.array(
    z.object({
      amount: z.string(),
      unit: z.object({ value: z.string(), label: z.string() }),
      name: z.object({ value: z.string(), label: z.string() }),
    }),
  ),
  ice: z.object({ value: z.string(), label: z.string() }),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateCocktailForm = () => {
  const { data: units } = api.unit.all.useQuery(undefined, {});
  const unitOptions =
    units?.map((unit) => ({
      value: unit.id,
      label: unit.name,
    })) || [];
  const { data: iceTypes } = api.ice.all.useQuery(undefined, {});
  const iceOptions =
    iceTypes?.map((iceType) => ({
      value: iceType.id,
      label: iceType.type,
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
  const createPresignedUrl = api.aws.createPresignedUrl.useMutation();

  const { register, handleSubmit, control, formState, reset, setValue } =
    useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        ingredients: [{ amount: "0", unit: undefined, name: undefined }],
        garnishes: [{ amount: "0", unit: undefined, name: undefined }],
        ice: undefined,
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

  const onSubmit = async (data: FormSchema) => {
    if (!data.image) return;
    const file = data.image;

    try {
      const presigned = (await createPresignedUrl.mutateAsync({
        fileName: file.name,
        fileType: file.type,
      })) as PresignedPost;
      const { url, fields } = presigned;

      const imageKey = fields.key as string;

      const formData = new FormData();

      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      await fetch(url, {
        method: "POST",
        body: formData,
      });

      await createCocktail.mutateAsync(
        {
          name: data.name,
          imageId: imageKey,
          ingredients: data.ingredients.map((ingredient) => ({
            amount: Number(ingredient.amount),
            unit: ingredient.unit.label,
            ingredient: ingredient.name.label,
          })),
          garnishes: data.garnishes.map((garnish) => ({
            amount: Number(garnish.amount),
            unit: garnish.unit.label,
            ingredient: garnish.name.label,
          })),
          ice: { type: data.ice.value },
        },
        {
          onSuccess: () => reset(),
        },
      );

      replaceIngredient([
        {
          amount: "0",
          unit: { value: "", label: "" },
          name: { value: "", label: "" },
        },
      ]);
      replaceGarnish([
        {
          amount: "0",
          unit: { value: "", label: "" },
          name: { value: "", label: "" },
        },
      ]);
      setValue("ice", { value: "", label: "" });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="Cocktail name" {...register("name")} />
      <p className="text-red-600">{formState.errors.name?.message}</p>

      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="md">
          Ingredients:
        </Heading>

        <Tooltip label="Add new ingredient">
          <Button
            variant="ghost"
            onClick={() =>
              appendIngredient({
                name: { label: "", value: "" },
                amount: "0",
                unit: { label: "", value: "" },
              })
            }
          >
            +
          </Button>
        </Tooltip>
      </Flex>

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
          <SimpleGrid
            columns={4}
            key={ingredient.id}
            templateColumns="auto 1fr 1fr auto"
            gap={2}
          >
            <Controller
              name={`ingredients.${index}.amount`}
              control={control}
              defaultValue={"1"}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  defaultValue={field.value}
                  step={0.1}
                  precision={1}
                  min={0}
                  onChange={(value) => field.onChange(value)}
                  maxW="100px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <Controller
              name={`ingredients.${index}.unit`}
              control={control}
              render={({ field }) => (
                <Creatable
                  {...field}
                  instanceId={`ingredients.${index}.unit`}
                  options={unitOptions}
                  placeholder="Select unit..."
                />
              )}
            />

            <Controller
              name={`ingredients.${index}.name`}
              control={control}
              render={({ field }) => (
                <Creatable
                  {...field}
                  instanceId={`ingredients.${index}.name`}
                  options={ingredientOptions}
                  placeholder="Select ingredient..."
                />
              )}
            />

            <Tooltip label="Delete ingredient">
              <Button variant="ghost" onClick={() => removeIngredient(index)}>
                🗑️
              </Button>
            </Tooltip>
          </SimpleGrid>
        </Fragment>
      ))}

      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="md">
          Garnishes:
        </Heading>

        <Tooltip label="Add new garnish">
          <Button
            variant="ghost"
            onClick={() =>
              appendGarnish({
                name: { value: "", label: "" },
                amount: "0",
                unit: { value: "", label: "" },
              })
            }
          >
            +
          </Button>
        </Tooltip>
      </Flex>

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
          <SimpleGrid
            columns={4}
            key={garnish.id}
            templateColumns="auto 1fr 1fr auto"
            gap={2}
          >
            <Controller
              name={`garnishes.${index}.amount`}
              control={control}
              defaultValue={"1"}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  defaultValue={field.value}
                  step={0.1}
                  precision={1}
                  min={0}
                  onChange={(value) => field.onChange(value)}
                  maxW="100px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <Controller
              name={`garnishes.${index}.unit`}
              control={control}
              render={({ field }) => (
                <Creatable
                  {...field}
                  instanceId={`garnishes.${index}.unit`}
                  options={unitOptions}
                  placeholder="Select unit..."
                />
              )}
            />

            <Controller
              name={`garnishes.${index}.name`}
              control={control}
              render={({ field }) => (
                <Creatable
                  {...field}
                  instanceId={`garnishes.${index}.name`}
                  options={garnishOptions}
                  placeholder="Select garnish..."
                />
              )}
            />

            <Tooltip label="Delete garnish">
              <Button variant="ghost" onClick={() => removeGarnish(index)}>
                🗑️
              </Button>
            </Tooltip>
          </SimpleGrid>
        </Fragment>
      ))}

      <Heading as="h3" size="md">
        Ice type:
      </Heading>

      <Controller
        name="ice"
        control={control}
        render={({ field }) => (
          <Creatable
            {...field}
            instanceId="ice"
            placeholder="Select ice type..."
            options={iceOptions}
          />
        )}
      />

      <Heading as="h3" size="md">
        Image:
      </Heading>

      <Center>
        <Controller
          name="image"
          control={control}
          render={({ field }) => <Dropzone onFileAccepted={field.onChange} />}
        />
      </Center>

      <Input type="submit" my={2} />
    </Box>
  );
};

export default CreateCocktailForm;

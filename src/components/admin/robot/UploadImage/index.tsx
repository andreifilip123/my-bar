import { useRobotContext } from "@/contexts/useRobotContext";
import { Flex, Heading, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import Dropzone from "@/components/admin/Dropzone";
import { api } from "@/utils/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
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
});

type FormSchema = z.infer<typeof formSchema>;

const UploadImage: NextPage = () => {
  const { setImage, setCurrentStep } = useRobotContext();

  const createPresignedUrl = api.aws.createPresignedUrl.useMutation();

  const { handleSubmit, control } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    if (!data.image) return;
    const file = data.image;

    try {
      const presigned = await createPresignedUrl.mutateAsync({
        fileName: file.name,
        fileType: file.type,
      });

      if (!presigned) return;

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

      setImage(imageKey);
      setCurrentStep("submitCocktail");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Flex flexDir="column">
      <Heading size="md" mb={5}>
        Upload an image
      </Heading>
      <form onSubmit={void handleSubmit(onSubmit)}>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <Dropzone {...field} onFileAccepted={field.onChange} />
          )}
        />

        <Input type="submit" mt={5} />
      </form>
    </Flex>
  );
};

export default UploadImage;

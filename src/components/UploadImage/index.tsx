import { Flex, Heading, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PresignedPost } from "aws-sdk/clients/s3";
import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import z from "zod";
import { useRobotContext } from "../../contexts/useRobotContext";

import { api } from "../../utils/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
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
});

type IFormInputs = {
  image: FileList;
};

const Admin: NextPage = () => {
  const { setImage } = useRobotContext();

  const createPresignedUrl = api.aws.createPresignedUrl.useMutation();

  const { register, handleSubmit } = useForm<IFormInputs>({
    resolver: zodResolver(formSchema),
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
      const imageId = imageKey.split("/")[1] as string;

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

      setImage(imageId);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Flex flexDir="column">
      <Heading size="md" mb={5}>
        Upload an image
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input type="file" multiple={false} {...register("image")} />

        <Input type="submit" mt={5} />
      </form>
    </Flex>
  );
};

export default Admin;

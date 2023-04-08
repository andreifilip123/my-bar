import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { serverEnv } from "../../env/schema.mjs";

const s3 = new S3Client({
  region: serverEnv.REGION,
  credentials: {
    accessKeyId: serverEnv.ACCESS_KEY ?? "",
    secretAccessKey: serverEnv.SECRET_ACCESS_KEY ?? "",
  },
});

const deleteImage = async (imageId?: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: serverEnv.BUCKET_NAME,
    Key: imageId,
  });
  await s3.send(deleteCommand);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const prisma = new PrismaClient({
    log: serverEnv.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  if (!prisma) {
    res.status(500).end("Prisma not initialized");
    return;
  }
  // delete all images from s3 that don't have a corresponding image in the db
  const listCommand = new ListObjectsV2Command({
    Bucket: serverEnv.BUCKET_NAME,
  });
  const images = await s3.send(listCommand);

  if (!images.Contents) {
    res.status(200).end("No images to delete");
    return;
  }

  const dbImages = await prisma.image.findMany();

  const s3Images = images.Contents.map((image) => image.Key);

  const imagesToDelete = s3Images.filter(
    (s3Image) => !dbImages.find((dbImage) => dbImage.id === s3Image),
  );

  if (imagesToDelete.length === 0) {
    res.status(200).end("No images to delete");
    return;
  }

  await Promise.all(
    imagesToDelete.map(async (imageToDelete) => {
      await deleteImage(imageToDelete);
    }),
  );
  res.status(200).end(`Deleted ${imagesToDelete.length} images`);
}

import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "@/env.mjs";

const s3 = new S3Client({
  region: env.REGION,
  credentials: {
    accessKeyId: env.ACCESS_KEY,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
});

const deleteImage = async (imageId?: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.BUCKET_NAME,
    Key: imageId,
  });
  await s3.send(deleteCommand);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const prisma = new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  if (!prisma) {
    res.status(500).end("Prisma not initialized");
    return;
  }
  // delete all images from s3 that don't have a corresponding image in the db
  const listCommand = new ListObjectsV2Command({
    Bucket: env.BUCKET_NAME,
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

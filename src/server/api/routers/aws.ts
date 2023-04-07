import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

import { serverEnv } from "../../../env/schema.mjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const s3 = new S3Client({ region: serverEnv.REGION });

export const awsRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.userId;

      const image = await ctx.prisma.image.create({
        data: {
          userId,
        },
      });

      return new Promise(async (resolve, reject) => {
        try {
          if (!serverEnv.BUCKET_NAME) throw new Error("No bucket name set");
          const signedPost = await createPresignedPost(s3, {
            Bucket: serverEnv.BUCKET_NAME,
            Key: image.id,
            Conditions: [
              ["content-length-range", 0, 10 * 1024 * 1024], // up to 10 MB
              ["starts-with", "$Content-Type", "image/"],
            ],
            Fields: {
              key: image.id,
              "Content-Type": input.fileType,
            },
            Expires: 60, // seconds
          });
          resolve(signedPost);
        } catch (error) {
          reject(error);
        }
      });
    }),

  getSignedUrl: publicProcedure
    .input(z.object({ imageKey: z.string() }))
    .query(async ({ input }) => {
      console.log("getSignedUrl", input);
      if (!serverEnv.BUCKET_NAME) throw new Error("No bucket name set");
      console.log("BUCKET_NAME", serverEnv.BUCKET_NAME);

      const command = new GetObjectCommand({
        Bucket: serverEnv.BUCKET_NAME,
        Key: input.imageKey,
      });
      console.log("command", command);
      const url = await awsGetSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
      console.log("url", url);

      return url;
    }),

  deleteFromS3: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      if (!serverEnv.BUCKET_NAME) throw new Error("No bucket name set");

      const command = new DeleteObjectCommand({
        Bucket: serverEnv.BUCKET_NAME,
        Key: input.key,
      });
      await s3.send(command);
    }),
});

import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

import { env } from "@/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const s3 = new S3Client({
  region: env.REGION,
  credentials: {
    accessKeyId: env.ACCESS_KEY,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
});

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

      try {
        const signedPost = await createPresignedPost(s3, {
          Bucket: env.BUCKET_NAME,
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
        return signedPost;
      } catch (error) {
        console.error(error);
      }
    }),

  getSignedUrl: publicProcedure
    .input(z.object({ imageKey: z.string() }))
    .query(async ({ input }) => {
      if (!env.BUCKET_NAME) throw new Error("No bucket name set");

      const command = new GetObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: input.imageKey,
      });
      const url = await awsGetSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds

      return url;
    }),

  deleteFromS3: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const command = new DeleteObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: input.key,
      });
      await s3.send(command);
    }),
});

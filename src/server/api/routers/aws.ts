import S3 from "aws-sdk/clients/s3";
import { z } from "zod";

import { serverEnv } from "../../../env/schema.mjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: serverEnv.ACCESS_KEY,
  secretAccessKey: serverEnv.SECRET_ACCESS_KEY,
  region: serverEnv.REGION,
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
      if (!ctx.session) throw new Error("Not authenticated");

      const userId = ctx.session.user.id;

      const image = await ctx.prisma.image.create({
        data: {
          userId,
        },
      });

      return new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: image.id,
              "Content-Type": input.fileType,
            },
            Conditions: [
              ["content-length-range", 0, 10 * 1024 * 1024], // up to 10 MB
              ["starts-with", "$Content-Type", "image/"],
            ],
            Expires: 60, // seconds
            Bucket: serverEnv.BUCKET_NAME,
          },
          (err, signed) => {
            if (err) return reject(err);
            resolve(signed);
          },
        );
      });
    }),

  getSignedUrl: publicProcedure
    .input(z.object({ imageKey: z.string() }))
    .query(({ input }) => {
      if (!serverEnv.BUCKET_NAME) throw new Error("No bucket name set");

      const url = s3.getSignedUrl("getObject", {
        Bucket: serverEnv.BUCKET_NAME,
        Key: input.imageKey,
        Expires: 60 * 15, // 15 minutes
      });

      return url;
    }),

  deleteFromS3: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(({ input }) => {
      if (!serverEnv.BUCKET_NAME) throw new Error("No bucket name set");

      const deletePromise = s3
        .deleteObject({
          Bucket: serverEnv.BUCKET_NAME,
          Key: input.key,
        })
        .promise();

      return deletePromise;
    }),
});

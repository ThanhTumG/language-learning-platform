import { Part } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const toeicTestsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const testsData = await ctx.db.find({
        collection: "toeic",
        sort: "-createdAt",
        limit: input.limit,
        page: input.cursor,
        where: {
          "metadata.isPublished": {
            equals: true,
          },
        },
        select: {
          audioFile: false,
          answers: false,
          parts: false,
        },
      });

      return testsData;
    }),
  getOne: baseProcedure
    .input(z.object({ testId: z.string() }))
    .query(async ({ ctx, input }) => {
      const testData = await ctx.db.findByID({
        collection: "toeic",
        id: input.testId,
        select: {
          audioFile: false,
          answers: false,
        },
      });

      if (!testData || testData.metadata?.isPublished !== true) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Test not found" });
      }

      const parts = Array.isArray(testData.parts)
        ? testData.parts.map((part) =>
            typeof part === "object" && part !== null
              ? { ...part, questionItems: undefined }
              : part
          )
        : [];

      return {
        ...testData,
        parts: parts as Part[] | [],
      };
    }),
});

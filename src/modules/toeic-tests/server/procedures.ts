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
      });

      const testsWithoutAnswer = {
        ...testsData,
        docs: testsData.docs.map((test) => {
          return {
            ...test,
            listeningSection: null,
            readingSection: null,
            answers: null,
          };
        }),
      };

      return testsWithoutAnswer;
    }),
  getOne: baseProcedure
    .input(z.object({ testId: z.string() }))
    .query(async ({ ctx, input }) => {
      const testData = await ctx.db.findByID({
        collection: "toeic",
        id: input.testId,
      });

      if (!testData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Test not found" });
      }

      return {
        ...testData,
        listeningSection: {
          ...testData.listeningSection,
          parts: null,
          partCount: testData.listeningSection.parts?.length,
        },
        readingSection: {
          ...testData.readingSection,
          parts: null,
          partCount: testData.readingSection.parts?.length,
        },
        answers: null,
      };
    }),
});

import { Media, Part } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const toeicAttemptsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        attemptId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const attemptData = await ctx.db.findByID({
        collection: "toeic-attempts",
        id: input.attemptId,
      });

      if (!attemptData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Toeic attempt not found",
        });
      }

      return attemptData;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const attemptsData = await ctx.db.find({
        collection: "toeic-attempts",
        depth: 2,
        page: input.cursor,
        limit: input.limit,
        where: {
          and: [
            {
              user: {
                equals: ctx.session.user.id,
              },
              status: {
                equals: "completed",
              },
            },
          ],
        },
      });

      return attemptsData;
    }),
  create: protectedProcedure
    .input(
      z.object({
        testId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const testData = await ctx.db.findByID({
        collection: "toeic",
        id: input.testId,
        select: {
          answers: false,
        },
      });

      if (!testData || testData.metadata?.isPublished !== true) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Test not found",
        });
      }

      const attemptStartExisting = await ctx.db.find({
        collection: "toeic-attempts",
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
            {
              test: {
                equals: input.testId,
              },
            },
            {
              status: {
                equals: "in_progress",
              },
            },
          ],
        },
      });

      if (attemptStartExisting.totalDocs === 0) {
        const attemptNumber = await ctx.db.count({
          collection: "toeic-attempts",
          where: {
            user: { equals: ctx.session.user.id },
            test: { equals: testData.id },
          },
        });

        await ctx.db.create({
          collection: "toeic-attempts",
          data: {
            user: ctx.session.user.id,
            test: testData.id,
            attemptTitle: testData.title,
            attemptNumber: attemptNumber.totalDocs + 1,
            status: "in_progress",
          },
        });
      }

      return {
        ...testData,
        parts: testData.parts as Part[] | [],
        audioFile: testData.audioFile as Media | null,
      };
    }),
});

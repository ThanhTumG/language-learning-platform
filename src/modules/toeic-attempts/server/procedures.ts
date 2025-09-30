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
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      return attemptsData;
    }),
});

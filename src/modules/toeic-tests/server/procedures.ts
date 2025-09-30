import { baseProcedure, createTRPCRouter } from "@/trpc/init";
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

      return testsData;
    }),
});

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const progressRouter = createTRPCRouter({
  getBySkill: protectedProcedure
    .input(
      z.object({
        skill: z.enum(["toeic", "ielts"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.find({
        collection: "progress",
        limit: 1,
        where: {
          and: [
            { user: { equals: ctx.session.user.id } },
            { skill: { equals: input.skill } },
          ],
        },
      });
      return result.docs?.[0] || null;
    }),
});

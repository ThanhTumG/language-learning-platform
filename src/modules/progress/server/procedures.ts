import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const progressRouter = createTRPCRouter({
  getOne: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.find({
      collection: "progress",
      limit: 1,
      where: {
        and: [{ user: { equals: ctx.session.user.id } }],
      },
    });
    return result.docs?.[0] || null;
  }),
});

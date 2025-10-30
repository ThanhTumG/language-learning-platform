import { Media } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const userRouter = createTRPCRouter({
  getInfo: protectedProcedure.query(async ({ ctx }) => {
    const userData = await ctx.db.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 1,
      select: {
        class: false,
      },
    });
    if (!userData) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return {
      ...userData,
      avatar: userData.avatar as Media | null,
    };
  }),
  updateInfo: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1).max(100),
        avatarId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update({
        collection: "users",
        id: ctx.session.user.id,
        data: {
          fullname: input.fullName,
          avatar: Number(input.avatarId),
        },
      });
    }),
});

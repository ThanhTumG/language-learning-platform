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
        imageBase64: z.string().optional(),
        mimeType: z.string().optional(),
        fileName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let avatarId = undefined;
      if (input.imageBase64 && input.mimeType && input.fileName) {
        const buffer = Buffer.from(
          input.imageBase64?.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        avatarId = await ctx.db.create({
          collection: "media",
          data: {
            alt: input.fileName,
          },

          file: {
            data: buffer,
            mimetype: input.mimeType,
            name: input.fileName,
            size: buffer.length,
          },
        });
      }
      await ctx.db.update({
        collection: "users",
        id: ctx.session.user.id,
        data: {
          fullname: input.fullName,
          avatar: avatarId,
        },
      });
    }),
});

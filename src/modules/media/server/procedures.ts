import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const mediaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        file: z.file(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const timestamps = Date.now().toLocaleString();

      //     const media = await ctx.db.create({
      //     collection: 'media',
      // data:{
      //     alt:`${ctx.session.user.id}-avatar-${timestamps}`
      // }
      //     file: input.file
      //   })

      //   return {
      //     id: media.id,
      //     url: media.url,
      //   }
    }),
});

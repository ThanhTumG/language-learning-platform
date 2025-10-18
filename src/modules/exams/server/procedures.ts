import { Part } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const examsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const classesId = ctx.session.user.class?.map((c) =>
      typeof c === "object" ? c.id : c
    );
    const classes = await ctx.db.find({
      collection: "classes",
      pagination: false,
      sort: "-createdAt",
      where: {
        id: {
          in: classesId,
        },
      },
    });

    const exams = classes.docs.flatMap((doc) => doc.exams?.map((e) => e));
    console.log({ exams });

    return exams;
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

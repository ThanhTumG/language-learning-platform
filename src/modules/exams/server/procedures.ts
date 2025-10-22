import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
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

    const exams = classes.docs.flatMap((doc) =>
      doc.exams?.map((e) => {
        if (typeof e === "number" || typeof e.test === "number") return null;
        return {
          ...e,
          test: {
            ...e.test,
            audioFile: undefined,
            answers: undefined,
            parts: undefined,
          },
        };
      })
    );

    return exams;
  }),
  getOne: protectedProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const examData = await ctx.db.findByID({
        collection: "exams",
        id: input.examId,
      });

      if (!examData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exam not found" });
      }

      if (!examData.test || typeof examData.test === "number") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Test not found" });
      }
      const testData = examData.test;

      const parts = Array.isArray(testData.parts)
        ? testData.parts.map((part) =>
            typeof part === "object" && part !== null
              ? { ...part, questionItems: undefined }
              : part
          )
        : [];

      return {
        ...examData,
        test: { ...testData, parts, audioFile: undefined, answers: undefined },
      };
    }),
});

import { calculateScore } from "@/lib/utils";
import { Media, Part, Progress, Toeic, User } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { ScoreByPartType } from "../type";

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
        depth: 2,
      });

      if (!attemptData || attemptData.status !== "completed") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Toeic attempt not found",
        });
      }
      return {
        ...attemptData,
        test: attemptData.test as Toeic | null,
      };
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
        examId: z.string().optional(),
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
          ],
        },
      });

      let attemptId = null;

      if (attemptStartExisting.totalDocs > 0) {
        attemptStartExisting.docs.forEach((attempt) => {
          if (
            attempt.status === "in_progress" ||
            testData.isPractice === false
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "You have an ongoing attempt for this test or you are not allowed to retake this test.",
            });
          }
        });
      }

      const attemptNumber = await ctx.db.count({
        collection: "toeic-attempts",
        where: {
          user: { equals: ctx.session.user.id },
          test: { equals: testData.id },
        },
      });

      const { id } = await ctx.db.create({
        collection: "toeic-attempts",
        data: {
          user: ctx.session.user.id,
          test: testData.id,
          attemptTitle: testData.title,
          attemptNumber: attemptNumber.totalDocs + 1,
          status: "in_progress",
        },
      });
      attemptId = id;

      if (input.examId) {
        const exam = await ctx.db.findByID({
          collection: "exams",
          id: input.examId,
          depth: 0,
        });

        const participants = exam.participant ?? [];

        await ctx.db.update({
          collection: "exams",
          id: input.examId,
          data: {
            participant: [...participants, ctx.session.user.id],
          },
        });
      }
      // attemptId = attemptStartExisting.docs[0].id;

      return {
        ...testData,
        parts: testData.parts as Part[] | [],
        audioFile: testData.audioFile as Media | null,
        attemptId: attemptId,
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        attemptId: z.number(),
        answers: z.record(z.string(), z.number()),
        timeSpend: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existAttempt = await ctx.db.findByID({
        collection: "toeic-attempts",
        id: input.attemptId,
      });

      if (!existAttempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attempt not found",
        });
      }

      const user = existAttempt.user as User;
      if (user.id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid user",
        });
      }

      if (existAttempt.status !== "in_progress") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `This attempt was ${existAttempt.status}`,
        });
      }

      const testData = existAttempt.test as Toeic;
      const testParts = testData.parts as Part[];
      const lilParts: {
        pType: "listening" | "reading";
        start: number;
        check: number;
      }[] = testParts?.map((part) => {
        return {
          pType: part.sectionType,
          start:
            part.questionItems && part.questionItems.length > 0
              ? part.questionItems[0].questions?.[0].questionNumber ?? 0
              : 0,
          check: 0,
        };
      });

      const answers = testData.answers ?? [];
      const liteAnswers: { [k: string]: number } = Object.fromEntries(
        answers.map((a, i) => [(i + 1).toString(), a.answer])
      );

      const scoreByPart: ScoreByPartType = Array.from({
        length: lilParts.length,
      }).map((_, index) => {
        return {
          questions: [],
          accuracyRate: 0,
          correctQuestions: 0,
          totalQuestions: testParts[index].questionCount,
        };
      });

      for (const qnKey in input.answers) {
        const pIdx = lilParts.findLastIndex((p) => p.start <= parseInt(qnKey));
        if (input.answers[qnKey] === liteAnswers[qnKey]) {
          lilParts[pIdx].check += 1;
          if (scoreByPart[pIdx]) scoreByPart[pIdx].correctQuestions += 1;
        }
        scoreByPart[pIdx]?.questions?.push({
          question: {
            questionNumber: parseInt(qnKey),
            userAnswer: input.answers[qnKey],
            correctAnswer: liteAnswers[qnKey],
          },
        });
      }

      const totalListening = lilParts.reduce(
        (prev, curr) => (curr.pType === "listening" ? prev + curr.check : prev),
        0
      );
      const totalReading = lilParts.reduce(
        (prev, curr) => (curr.pType === "reading" ? prev + curr.check : prev),
        0
      );

      const listenScore = calculateScore({
        tType: "toeic",
        pType: "listening",
        correct: totalListening,
      });
      const readingScore = calculateScore({
        tType: "toeic",
        pType: "reading",
        correct: totalReading,
      });

      const { id } = await ctx.db.update({
        collection: "toeic-attempts",
        id: input.attemptId,
        data: {
          status: "completed",
          timeSpent: input.timeSpend / 60000,
          scores: {
            listening: listenScore,
            reading: readingScore,
          },
          parts: scoreByPart.map((p) => ({
            ...p,
            accuracyRate:
              p && p?.totalQuestions
                ? Math.round((p?.correctQuestions / p?.totalQuestions) * 100)
                : 0,
          })),
        },
      });

      const progressData = await ctx.db.find({
        collection: "progress",
        where: { user: { equals: user.id } },
      });

      let progress: Progress | null = null;

      if (progressData.totalDocs > 0) {
        progress = progressData.docs[0];

        const skillIndex =
          progress.skill?.findIndex((s) => s.type === "toeic") ?? -1;
        const skillData =
          skillIndex !== -1 ? progress.skill?.[skillIndex] : undefined;
        const attempt = skillData?.totalTestsCompleted ?? 0;
        const listenIdx =
          skillData?.skillsAverage?.findIndex(
            (sa) => sa.subSkill === "listening"
          ) ?? -1;
        const readIdx =
          skillData?.skillsAverage?.findIndex(
            (sa) => sa.subSkill === "reading"
          ) ?? -1;

        if (
          skillData?.skillsAverage &&
          listenIdx !== -1 &&
          readIdx !== -1 &&
          skillIndex !== -1 &&
          progress.skill
        ) {
          skillData.skillsAverage[listenIdx].averageScore =
            ((skillData.skillsAverage[listenIdx].averageScore ?? 0) * attempt +
              listenScore) /
            (attempt + 1);
          skillData.skillsAverage[readIdx].averageScore =
            ((skillData.skillsAverage[readIdx].averageScore ?? 0) * attempt +
              readingScore) /
            (attempt + 1);
          skillData.averageScore =
            ((skillData?.averageScore ?? 0) * attempt +
              (listenScore + readingScore)) /
            (attempt + 1);
          skillData.bestScore = Math.max(
            skillData.bestScore ?? 0,
            listenScore + readingScore
          );
          skillData.totalTestsCompleted =
            (skillData.totalTestsCompleted ?? 0) + 1;
          skillData.totalStudyTime =
            (skillData.totalStudyTime ?? 0) + input.timeSpend / 60000;

          progress.skill[skillIndex] = skillData;
          console.log("progress", progress);
        }

        await ctx.db.update({
          collection: "progress",
          where: {
            user: {
              equals: user.id,
            },
          },
          data: {
            ...progress,
            skill: progress.skill,
          },
        });
      }
      return id;
    }),
});

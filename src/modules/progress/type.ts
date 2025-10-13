import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";
export type ProgressGetOneOutput =
  inferRouterOutputs<AppRouter>["progress"]["getOne"];

export type ProgressBySkillOutput =
  | {
      type: "toeic" | "ielts";
      totalStudyTime?: number | null;
      totalTestsCompleted?: number | null;
      averageScore?: number | null;
      skillsAverage?:
        | {
            subSkill: "listening" | "reading" | "writing" | "speaking";
            averageScore?: number | null;
            id?: string | null;
          }[]
        | null;
      bestScore?: number | null;
      learningGoals?: {
        targetScore?: number | null;
      };
      id?: string | null;
    }
  | null
  | undefined;

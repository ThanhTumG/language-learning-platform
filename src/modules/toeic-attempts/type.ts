import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";
import { Media } from "@/payload-types";

export type ToeicAttemptsCreateOutput =
  inferRouterOutputs<AppRouter>["toeicAttempts"]["create"];

export type QuestionType = {
  type: "listen" | "write" | "read" | "speak";
  questionNumber: number;
  questionText?: string | null;
  imageFile?: (number | null) | Media;
  options?:
    | {
        option: string;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
};

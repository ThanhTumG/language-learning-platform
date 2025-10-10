import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type ToeicAttemptsCreateOutput =
  inferRouterOutputs<AppRouter>["toeicAttempts"]["create"];

export type ToeicAttemptsPartOutput = ToeicAttemptsCreateOutput["parts"];

export type ToeicAttemptsQuestionItemOutput = {
  questionContent?: SerializedEditorState | null;
  questions?:
    | {
        questionNumber: number;
        questionText?: string | null;
        options?:
          | {
              optionText: string;
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
};

export type ScoreByPartType =
  | (
      | {
          accuracyRate?: number | null | undefined;
          totalQuestions: number;
          correctQuestions: number;
          questions?:
            | (
                | {
                    question?:
                      | {
                          questionNumber?: number | undefined;
                          userAnswer?: number | null | undefined;
                          correctAnswer?: number | null | undefined;
                        }
                      | undefined;
                    id?: string | null | undefined;
                  }
                | undefined
              )[]
            | null
            | undefined;
          id?: string | null | undefined;
        }
      | undefined
    )[]
  | null
  | undefined;

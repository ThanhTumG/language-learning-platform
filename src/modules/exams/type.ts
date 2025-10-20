import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type ExamsGetManyOutput =
  inferRouterOutputs<AppRouter>["exams"]["getMany"];

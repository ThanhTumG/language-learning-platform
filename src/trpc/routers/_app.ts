import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { ToeicAttemptsRouter } from "@/modules/toeic-attempts/server/procedures";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  toeicAttempts: ToeicAttemptsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

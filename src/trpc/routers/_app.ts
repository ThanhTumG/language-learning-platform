import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { ToeicAttemptsRouter } from "@/modules/toeic-attempts/server/procedures";
import { UserRouter } from "@/modules/user/server/procedures";
import { ProgressRouter } from "@/modules/progress/server/procedures";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: UserRouter,
  toeicAttempts: ToeicAttemptsRouter,
  progress: ProgressRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

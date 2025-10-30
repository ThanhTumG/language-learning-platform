import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { toeicAttemptsRouter } from "@/modules/toeic-attempts/server/procedures";
import { userRouter } from "@/modules/user/server/procedures";
import { progressRouter } from "@/modules/progress/server/procedures";
import { toeicTestsRouter } from "@/modules/toeic-tests/server/procedures";
import { examsRouter } from "@/modules/exams/server/procedures";
import { mediaRouter } from "@/modules/media/server/procedures";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  toeic: toeicTestsRouter,
  toeicAttempts: toeicAttemptsRouter,
  progress: progressRouter,
  exams: examsRouter,
  media: mediaRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

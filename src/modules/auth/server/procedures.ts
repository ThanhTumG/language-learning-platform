import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),
  logout: baseProcedure.mutation(async ({ ctx }) => {
    const cookies = await getCookies();
    cookies.delete(`${ctx.db.config.cookiePrefix}-token`);
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          fullname: input.fullname,
          password: input.password,
        },
      });

      await ctx.db.create({
        collection: "progress",
        data: {
          user: id,
          skill: [
            {
              type: "toeic",
              averageScore: 0,
              bestScore: 0,
              totalStudyTime: 0,
              learningGoals: { targetScore: undefined },
              skillsAverage: [
                { subSkill: "listening", averageScore: 0 },
                { subSkill: "reading", averageScore: 0 },
              ],
              totalTestsCompleted: 0,
            },
          ],
        },
      });

      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
      });

      return data;
    }),
  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to login",
      });
    }

    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    });
    return data;
  }),
});

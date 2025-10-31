import z from "zod";

export const profileSchema = z.object({
  fullname: z.string().min(1).max(100),
  avatar: z
    .file()
    .optional()
    .refine((f) => !f || f.size < 5_000_000, "File must be < 5MB"),
});

export const changePasswordSchema = z
  .object({
    newPw: z.string().min(1, "New password is required"),
    confirmPw: z.string().min(1, "Confirm password is required"),
  })
  .refine((value) => value.newPw === value.confirmPw, {
    error: "New password and Confirm password not matched",
    path: ["confirmPw"],
  });

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

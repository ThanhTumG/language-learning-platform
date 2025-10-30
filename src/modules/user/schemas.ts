import z from "zod";

export const profileSchema = z.object({
  fullname: z.string().min(1).max(100),
  avatar: z
    .file()
    .refine((f) => !f || f.size < 5_000_000, "File must be < 5MB"),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;

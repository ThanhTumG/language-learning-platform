import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Password cannot contain special characters",
    }),
  fullname: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long." })
    .max(50, { message: "Full name must be at most 50 characters long." })
    .regex(/^[A-Za-zÀ-ỹ\s'-]+$/, {
      message: "Full name can only contain letters and spaces.",
    }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { message: "Password is required" }),
});

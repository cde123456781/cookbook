import * as z from "zod";

export const SignUpValidator = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username should only contain alphanumeric characters, underscores, and dots",
    ),
  email: z
    .string()
    .nonempty("Email cannot be empty")
    .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

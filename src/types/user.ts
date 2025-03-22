import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isAdmin: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  profileImg: z.string().optional(),
  company: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
});

export const passwordSetSchema = z
  .object({
    // id: z.string().min(1, "Valid Id is not provided."),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    //   .regex(/[@$!%*#?&]/, {
    //     message: "Password must include special characters",
    // })
    // .regex(/\d/, {
    //     message: "Password must include a number",
    // }),
    password2: z.string(),
    // verificationToken: z.string().min(1, { message: "Valid Token is not provided." }),
  })
  .refine(data => data.password == data.password2, {
    message: "Passwords doesn't match",
    path: ["password2"],
  });

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "This field is Required").email("Invalid Email"),
  password: z.string().min(1, "This field is Required"),
});

export const preRegisterSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "This field is Required").email("Invalid Email"),
  firstName: z.string().min(1, "This field is Required"),
  lastName: z.string().min(1, "This field is Required"),
});

// export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof signInSchema>;
export type TUser = z.infer<typeof userSchema>;
export type TPassInput = z.infer<typeof passwordSetSchema>;
export type TPreRegister = z.infer<typeof preRegisterSchema>;

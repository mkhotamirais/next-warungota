import z from "zod";

export const SignupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SigninSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const BlogCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Blog category name is required" })
    .transform((val) => val.trim()),
});

export const BlogSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title is too long"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    image: z
      .any()
      .refine((file): file is File | null => file === null || file instanceof File, "Invalid file")
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
      .refine((file) => !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type), "Only JPEG/PNG allowed"),
    // .nullable()
    // .optional(),
    categoryId: z.cuid("Invalid category ID"),
  })
  .transform((data) => ({
    ...data,
    slug: data.title.toLowerCase().replace(/\s+/g, "-"), // auto slug
  }));

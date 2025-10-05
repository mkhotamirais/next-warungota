import z from "zod";

export const AccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
});

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

export const BlogCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Blog category name is required" })
      .transform((val) => val.trim()),
  })
  .transform((data) => ({
    ...data,
    slug: data.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim(),
  }));

export const BlogSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title is too long"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    image: z
      .any()
      .refine((file): file is File | null => file === null || file instanceof File, "Invalid file")
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
      .refine(
        (file) => !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        "Only JPG/JPEG/PNG allowed"
      ),
    // .nullable()
    // .optional(),
    categoryId: z.cuid("Invalid category ID"),
  })
  .transform((data) => ({
    ...data,
    slug: data.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim(),
  }));

export const ProductCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Product category name is required" })
      .transform((val) => val.trim()),
  })
  .transform((data) => ({
    ...data,
    slug: data.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim(),
  }));

export const ProductSchema = z
  .object({
    name: z.string().min(1, { message: "Nama produk tidak boleh kosong." }),
    price: z
      .string()
      .min(1, { message: "Harga tidak boleh kosong." })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), {
        message: "Harga harus berupa angka.",
      })
      .refine((val) => val >= 0, {
        message: "Harga harus angka positif.",
      }),
    stock: z.coerce.number().min(0, { message: "Stock harus angka positif." }),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // categoryId: z.string().min(1, { message: "Kategori harus dipilih." }),
    categoryId: z.cuid("Invalid category ID"),
    image: z
      .any()
      .refine((file): file is File | null => file === null || file instanceof File, "Invalid file")
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
      .refine((file) => !file || file.type.startsWith("image/"), {
        message: "Tipe file tidak valid. Hanya format gambar yang diizinkan.",
      })
      .optional(),
  })
  .transform((data) => ({
    ...data,
    slug: data.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim(),
  }));

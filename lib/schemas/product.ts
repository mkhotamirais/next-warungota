import z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, { message: "Nama produk tidak boleh kosong." }),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Harga tidak boleh kosong")
    .refine((val) => !isNaN(Number(val)), "Harga harus berupa angka")
    .refine((val) => Number(val) >= 0, "Harga harus angka positif"),
  stock: z
    .string()
    .min(1, "Stok tidak boleh kosong")
    .refine((val) => !isNaN(Number(val)), "Stok harus berupa angka")
    .refine((val) => Number(val) >= 0, "Stok harus angka positif"), //   .string()
  tags: z.array(z.string()),
  // categoryId: z.cuid("Invalid category ID"),
  categoryId: z.cuid("Invalid category ID"),
  image: z
    .any()
    .refine((file): file is File | null => file === null || file instanceof File, "Invalid file")
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Tipe file tidak valid. Hanya format gambar yang diizinkan.",
    })
    .nullable()
    .optional(),
});

export const productCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Product category name is required" })
    .transform((val) => val.trim()),
});

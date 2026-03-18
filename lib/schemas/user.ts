import z from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Label alamat wajib diisi."),
  recipient: z.string().min(3, "Nama penerima wajib diisi."),
  phone: z.string().regex(/^\+?[0-9\s-]{7,20}$/, "Format nomor telepon tidak valid."),
  street: z.string().min(5, "Alamat jalan harus cukup detail."),
  province: z.string().min(1, "Provinsi wajib diisi."),
  regency: z.string().min(1, "Kabupaten/Kota wajib diisi."),
  district: z.string().min(1, "Kecamatan wajib diisi."),
  village: z.string().min(1, "Desa/Kelurahan wajib diisi."),
  postalCode: z.string().min(3, "Kode pos tidak valid."),
  isDefault: z.boolean().optional(),
});

export const deleteAccountSchema = z.object({
  text: z.string().min(1, "Text wajib diisi."),
});

export const profileDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ message: "Invalid email address" }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // 1. Hapus semua karakter non-digit (termasuk spasi, tanda kurung, strip, dll.)
        const cleaned = val.replace(/\D/g, "");
        // 2. Cek apakah panjangnya berada dalam rentang yang wajar (misalnya, 8 hingga 15 digit)
        return cleaned.length >= 8 && cleaned.length <= 15;
      },
      {
        message: "Nomor telepon harus antara 8 sampai 15 digit.",
      },
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Password lama harus memiliki minimal 8 karakter"),
    newPassword: z.string().min(8, "Password baru harus memiliki minimal 8 karakter"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password baru tidak cocok",
    path: ["confirmNewPassword"],
  });

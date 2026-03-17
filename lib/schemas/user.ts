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

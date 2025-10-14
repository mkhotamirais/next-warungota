import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddressSchema } from "@/lib/zod";
import { z } from "zod";

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  const validatedFields = AddressSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
  }

  const { isDefault, ...data } = validatedFields.data;

  const cleanData = { ...data, label: data.label || "Alamat Baru" };

  const defaultStatus = isDefault ?? false;
  let address;

  try {
    // Jalankan operasi dalam transaksi untuk atomicity, terutama saat mengubah status default
    await prisma.$transaction(async (tx) => {
      // Cek apakah ini alamat pertama pengguna
      const addressCount = await tx.address.count({ where: { userId } });
      const isFirstAddress = addressCount === 0;

      // Logika: Jika alamat pertama, otomatis set default=true. Jika bukan, ikuti input (defaultStatus).
      const newIsDefault = isFirstAddress || defaultStatus;

      // 1. Jika alamat baru ini akan menjadi default, set semua yang lama menjadi non-default
      if (newIsDefault && !isFirstAddress) {
        await tx.address.updateMany({
          where: { userId: userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // 2. Buat Alamat Baru (CREATE)
      address = await tx.address.create({
        data: {
          ...cleanData,
          userId: userId,
          isDefault: newIsDefault,
        },
      });
    });

    return Response.json({ message: "Alamat baru berhasil ditambahkan.", address }, { status: 201 });
  } catch (error) {
    console.error("API Address POST error:", error);

    // Tangani error duplikat label (P2002) karena @@unique([userId, label])
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return Response.json(
        { error: "Anda sudah memiliki alamat dengan label ini. Pilih label lain." },
        { status: 400 }
      );
    }

    return Response.json({ message: "Terjadi kesalahan server saat menyimpan alamat." }, { status: 500 });
  }
};

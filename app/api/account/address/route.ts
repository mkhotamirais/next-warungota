import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddressSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
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
    await prisma.$transaction(async (tx) => {
      const addressCount = await tx.address.count({ where: { userId } });
      const isFirstAddress = addressCount === 0;

      const newIsDefault = isFirstAddress || defaultStatus;

      if (newIsDefault && !isFirstAddress) {
        await tx.address.updateMany({ where: { userId: userId, isDefault: true }, data: { isDefault: false } });
      }

      address = await tx.address.create({ data: { ...cleanData, userId: userId, isDefault: newIsDefault } });
    });

    revalidatePath("/dashboard/account/address");
    return Response.json({ message: "Alamat baru berhasil ditambahkan.", address }, { status: 201 });
  } catch (error) {
    console.error("API Address POST error:", error);

    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return Response.json(
        { error: "Anda sudah memiliki alamat dengan label ini. Pilih label lain." },
        { status: 400 }
      );
    }

    return Response.json({ message: "Terjadi kesalahan server saat menyimpan alamat." }, { status: 500 });
  }
};

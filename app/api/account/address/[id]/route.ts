import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddressSchema } from "@/lib/zod";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  // Validasi data yang dikirim
  const validatedFields = AddressSchema.safeParse(body);
  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
  }

  const { isDefault, ...data } = validatedFields.data;
  const defaultStatus = isDefault ?? false;
  let updatedAddress;

  try {
    await prisma.$transaction(async (tx) => {
      const existingAddress = await tx.address.findFirst({
        where: { userId, id: id },
        select: { id: true, isDefault: true },
      });

      if (!existingAddress) {
        return Response.json({ error: "Alamat tidak ditemukan." }, { status: 404 });
      }

      if (defaultStatus && !existingAddress.isDefault) {
        await tx.address.updateMany({ where: { userId: userId, isDefault: true }, data: { isDefault: false } });
      }

      updatedAddress = await tx.address.update({
        where: { id: existingAddress.id },
        data: { ...data, id, isDefault: defaultStatus },
      });

      revalidatePath("/dashboard/account/address");
    });

    if (updatedAddress) {
      return Response.json({ message: "Alamat berhasil diperbarui.", address: updatedAddress }, { status: 200 });
    }

    return Response.json({ error: "Alamat tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("API Address PUT error:", error);

    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return Response.json({ error: "Alamat baru sudah digunakan. Pilih id yang unik." }, { status: 400 });
    }

    return Response.json({ message: "Terjadi kesalahan server saat memperbarui alamat." }, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    let deletedAddress;

    await prisma.$transaction(async (tx) => {
      const addressToDelete = await tx.address.findFirst({ where: { userId, id } });

      if (!addressToDelete) {
        return Response.json({ error: "Alamat tidak ditemukan." }, { status: 404 });
      }

      deletedAddress = await tx.address.delete({ where: { id: addressToDelete.id } });

      if (addressToDelete.isDefault) {
        const remainingAddress = await tx.address.findFirst({ where: { userId }, orderBy: { createdAt: "asc" } });

        if (remainingAddress) {
          await tx.address.update({ where: { id: remainingAddress.id }, data: { isDefault: true } });
        }
      }

      revalidatePath("/dashboard/account/address");
    });

    if (deletedAddress) {
      return Response.json({ message: `Alamat dengan id '${id}' berhasil dihapus.` }, { status: 200 });
    }

    return Response.json({ error: "Alamat tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("API Address DELETE error:", error);
    return Response.json({ message: "Terjadi kesalahan server saat menghapus alamat." }, { status: 500 });
  }
};

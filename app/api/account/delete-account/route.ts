import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DeleteAccountSchema } from "@/lib/zod";
import { z } from "zod";

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  const validatedFields = DeleteAccountSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
  }

  try {
    // 3. Eksekusi Transaksi Penghapusan (Atomicity)
    // Walaupun banyak relasi menggunakan onDelete: Cascade, kita menggunakan transaksi
    // deleteMany eksplisit untuk model perantara dan memastikan urutan penghapusan yang benar
    // dan menghindari error Foreign Key.
    await prisma.$transaction(async (tx) => {
      // A. Hapus Items (Level terdalam yang menunjuk ke entitas lain, bukan user)

      // Hapus Item Keranjang (CartItem) - Relasinya ke Cart (yang punya userId)
      await tx.cartItem.deleteMany({
        where: { Cart: { userId: userId } },
      });

      // Hapus Item Order (OrderItem) - Relasinya ke Order (yang punya userId)
      await tx.orderItem.deleteMany({
        where: { Order: { userId: userId } },
      });

      // B. Hapus Entitas Anak Utama (Langsung menunjuk ke userId)

      // Hapus Blog yang dibuat user
      await tx.blog.deleteMany({
        where: { userId: userId },
      });

      // Hapus Produk yang dibuat user
      await tx.product.deleteMany({
        where: { userId: userId },
      });

      // Hapus Keranjang (Cart)
      // Cart punya relasi one-to-one (User -> Cart)
      await tx.cart.deleteMany({
        where: { userId: userId },
      });

      // Hapus Order
      await tx.order.deleteMany({
        where: { userId: userId },
      });

      // C. Hapus Record Autentikasi dan Token (onDelete: Cascade di model)

      // Hapus Accounts (NextAuth) - Relasi ini sudah CASCADE, tapi dihapus eksplisit
      await tx.account.deleteMany({
        where: { userId: userId },
      });

      // Hapus PasswordResetToken (NextAuth) - Relasi ini sudah CASCADE
      await tx.passwordResetToken.deleteMany({
        where: { userId: userId },
      });

      // Hapus record sesi (Jika Anda menggunakan Session di schema)
      // await tx.session.deleteMany({
      //    where: { userId: userId }
      // });

      // D. Hapus Entitas Induk (USER)
      await tx.user.delete({
        where: { id: userId },
      });
    });

    // 4. Respon Sukses
    return Response.json({ message: "Akun dan semua data terkait berhasil dihapus secara permanen." }, { status: 200 });
  } catch (error) {
    console.error("API Delete Account error:", error);

    return Response.json(
      { message: "Terjadi kesalahan server saat memproses penghapusan akun. Beberapa data mungkin gagal dihapus." },
      { status: 500 }
    );
  }
}

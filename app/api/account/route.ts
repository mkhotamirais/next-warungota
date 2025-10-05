import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const { name, phone } = body;

    // 2. Validasi Data
    const updateData: { name?: string; phone?: string | null } = {};

    // Validasi dan tambahkan name jika disediakan
    if (typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim();
    }

    // Validasi dan tambahkan phone jika disediakan (juga izinkan string kosong untuk menghapus)
    if (typeof phone === "string") {
      updateData.phone = phone.trim().length > 0 ? phone.trim() : null;
    } else if (phone === null) {
      updateData.phone = null;
    }

    // Jika tidak ada data yang valid untuk diperbarui
    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ message: "No valid fields provided for update." }), { status: 400 });
    }

    // 3. Perbarui Data Pengguna di Database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { name: true, phone: true, email: true }, // Hanya kembalikan field yang aman
    });

    // 4. Respon Sukses
    return new Response(
      JSON.stringify({
        message: "Account updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API Account PATCH error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}

// // Untuk memastikan metode lain (GET, POST, dll.) dikembalikan dengan 405 Method Not Allowed
// export async function GET() {
//   return new Response(null, { status: 405 });
// }
// // Tambahkan handler untuk metode HTTP lain yang tidak diizinkan di sini jika diperlukan.

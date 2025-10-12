// actions/auth.ts (Tambahkan fungsi ini)

import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt-ts";

const SALT_ROUNDS = 10;

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const email = formData.get("email") as string;
  const newPassword = formData.get("password") as string;

  if (!token || !email || !newPassword || newPassword.length < 8) {
    return { error: "Input tidak valid. Pastikan password minimal 8 karakter." };
  }

  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token: token, User: { email: email } },
    });

    if (!resetToken) {
      return { error: "Tautan reset tidak valid atau sudah digunakan." };
    }

    if (resetToken.expires < new Date()) {
      return { error: "Tautan reset sudah kedaluwarsa." };
    }

    const hashedPassword = await hash(newPassword, SALT_ROUNDS);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return { success: "Password berhasil direset! Silakan Login." };
  } catch (error) {
    console.error("Reset password failed:", error);
    return { error: "Terjadi kesalahan server saat mereset password." };
  }
}

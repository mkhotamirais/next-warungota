import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_PORT === "465",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

/**
 * Membuat token verifikasi, menyimpannya di DB, dan mengirim email.
 * @param email - Email pengguna yang akan diverifikasi.
 */
export async function sendVerificationEmail(email: string) {
  // 1. Buat Token Verifikasi Aman
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 3600 * 1000); // Kadaluarsa dalam 24 jam

  // 2. Simpan Token ke Database
  // Hapus token lama jika ada (untuk token yang belum kedaluwarsa)
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  // Buat token baru
  await prisma.verificationToken.create({
    data: { identifier: email, token: token, expires: expires },
  });

  // 3. Buat URL Verifikasi
  const baseUrl = process.env.NODE_ENV === "production" ? process.env.URL_PROD : process.env.URL_DEV;
  const verificationUrl = `${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}`;

  // Asumsi kita mendapatkan nama pengguna dari database untuk personalisasi email
  const user = await prisma.user.findUnique({ where: { email } });
  const userName = user?.name || "Pengguna";

  // 4. Kirim Email
  await transporter.sendMail({
    from: process.env.EMAIL_FROM, // Contoh: noreply@domainanda.com
    to: email,
    subject: "Verifikasi Alamat Email Anda",
    html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2>Verifikasi Email Akun Anda</h2>
                <p>Halo ${userName},</p>
                <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda:</p>
                <a 
                    href="${verificationUrl}" 
                    style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #1d4ed8; color: white; text-decoration: none; border-radius: 5px;"
                    target="_blank"
                >
                    Verifikasi Email
                </a>
                <p style="font-size: 12px; color: #777;">Tautan ini akan kedaluwarsa dalam 24 jam.</p>
            </div>
        `,
  });
}

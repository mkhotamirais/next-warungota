import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string) {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 3600 * 1000);

    // 1. Hapus token lama dan buat yang baru
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({
      data: { identifier: email, token: token, expires: expires },
    });

    // 2. Buat URL Verifikasi menggunakan NEXTAUTH_URL
    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL not set in environment.");
    }
    const verificationUrl = `${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}`;

    const user = await prisma.user.findUnique({ where: { email } });
    const userName = user?.name || "Pengguna";

    // 3. Kirim Email melalui Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@warungota.com",
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

    if (result.error) {
      console.error("Resend Error:", result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }
  } catch (error) {
    console.error("Email verification send process error:", error);
    throw new Error("Failed to send verification email. Please try again.");
  }
}

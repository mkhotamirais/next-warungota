import { NextResponse } from "next/server";
import crypto from "crypto";
import { resend } from "@/lib/resend";
import prisma from "@/lib/prisma";
import { baseUrl } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { newEmail, userId, callbackUrl } = body;

    if (!newEmail || !userId)
      return NextResponse.json({ error: "New email and User ID are required" }, { status: 400 });

    const token = crypto.randomBytes(32).toString("hex");

    // 2. Update token di database User
    await prisma.user.update({ where: { id: userId }, data: { emailChangeVerificationToken: token } });

    // 3. Setup URL Verifikasi
    const finalRedirect = callbackUrl || "/user";
    const separator = finalRedirect.includes("?") ? "&" : "?";
    const callbackWithQuery = `${finalRedirect}${separator}verify-email=update-email`;

    const verificationUrl = `${baseUrl}/verify-email-change?token=${token}&userId=${userId}&callbackUrl=${encodeURIComponent(callbackWithQuery)}`;

    // 4. Ambil data user untuk nama panggilan
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.name || "Pengguna";

    // 5. Kirim Email melalui Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@vryce.id",
      to: newEmail,
      subject: "Konfirmasi Perubahan Alamat Email Anda",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; max-width: 600px; margin: auto;">
            <h2 style="color: #333;">Konfirmasi Email Baru</h2>
            <p>Halo ${userName},</p>
            <p>Anda telah meminta perubahan alamat email. Silakan klik tombol di bawah ini untuk mengkonfirmasi alamat email baru Anda (<strong>${newEmail}</strong>):</p>
            <div style="text-align: center; margin: 30px 0;">
                <a 
                    href="${verificationUrl}" 
                    style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;"
                    target="_blank"
                >
                    Konfirmasi Email Baru
                </a>
            </div>
            <p style="font-size: 12px; color: #777;">Jika Anda tidak meminta perubahan ini, mohon abaikan email ini. Keamanan akun Anda tetap terjaga.</p>
        </div>
      `,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Change verification email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("API Error (Email Change):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

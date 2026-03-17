import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { baseUrl } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, userId, callbackUrl } = body;

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 3600 * 1000);

    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({ data: { identifier: email, token: token, expires: expires } });

    const finalRedirect = callbackUrl || "/";
    const separator = finalRedirect.includes("?") ? "&" : "?";
    const callbackWithQuery = `${finalRedirect}${separator}verify-email=new-email`;

    const verificationUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackWithQuery)}`;

    const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
    const userName = user?.name || "Pengguna";

    // 3. Send Email
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Verifikasi Alamat Email Anda",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Halo ${userName},</h2>
            <p>Klik tombol di bawah untuk verifikasi email:</p>
            <a href="${verificationUrl}" style="background: #1d4ed8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Verifikasi Email
            </a>
        </div>
      `,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Verification email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

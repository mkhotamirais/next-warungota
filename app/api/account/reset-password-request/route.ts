import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = () => {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + 3600 * 1000),
  };
};

const ipCache = new Map<string, { count: number; lastRequest: number }>();

export const POST = async (req: Request) => {
  try {
    const { email, confirm_username } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const COOLDOWN_TIME = 60 * 1000; // 1 Menit

    let attempt = ipCache.get(ip);

    if (attempt && now - attempt.lastRequest > COOLDOWN_TIME) {
      attempt = { count: 0, lastRequest: now };
    }

    const currentCount = (attempt?.count || 0) + 1;

    if (currentCount > 3) {
      const diff = now - (attempt?.lastRequest || now);
      const secondsToWait = Math.ceil((COOLDOWN_TIME - diff) / 1000);

      return Response.json(
        {
          message: `Too many requests. Please try again in`,
          seconds: secondsToWait,
        },
        { status: 429 },
      );
    }

    ipCache.set(ip, { count: currentCount, lastRequest: now });

    if (confirm_username) {
      return Response.json(
        { ok: false, message: "If the email is registered, a password reset link has been sent to your inbox" },
        { status: 200 },
      );
    }

    if (!email) return Response.json({ ok: false, message: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    const finalMessage = `If the email is registered, a password reset link has been sent to your inbox`;

    if (!user) return Response.json({ ok: false, message: finalMessage }, { status: 200 });

    const { token, expires } = generateToken();
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}&email=${email}`;

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { token, expires },
      create: { userId: user.id, token, expires },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset Password Warungota",
      html: `<p>Anda meminta reset password. Klik tautan berikut dalam 1 hour:</p><p><a target="_blank" href="${resetLink}">Reset Password</a></p>`,
    });

    return Response.json({ ok: true, message: finalMessage }, { status: 200 });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
};

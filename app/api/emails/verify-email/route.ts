import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { token, email } = body || {};

    if (!token || !email) return Response.json({ message: "Token and email are required" }, { status: 400 });

    const normalizedEmail = email.toLowerCase();

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: normalizedEmail, token },
    });

    if (!verificationToken) {
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      const status = user?.emailVerified ? 200 : 404;
      const message = user?.emailVerified ? "Email already verified" : "Token not found or invalid";
      return Response.json({ message }, { status });
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail, token } });
      return Response.json({ message: "Token has expired" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({ where: { email: normalizedEmail }, data: { emailVerified: new Date() } }),
      prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail, token } }),
    ]);

    return Response.json({ message: "Email successfully verified" });
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

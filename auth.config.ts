import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import prisma from "./lib/prisma";
import { compareSync } from "bcrypt-ts";
import { baseUrl } from "./lib/constants";

class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

const loginLimitCache = new Map<string, { attempts: number; lockUntil: number }>();

export default {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: { email: {}, password: {}, confirm_username: {} },
      authorize: async (credentials, req) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const confirm_username = credentials?.confirm_username as string | undefined;

        // Ambil IP dari header (Vercel/Next.js standar)
        const ip = (req.headers.get("x-forwarded-for") as string) || "unknown";
        const now = Date.now();

        // 1. HONEYPOT CHECK
        if (confirm_username) {
          throw new CustomAuthError("Invalid credentials");
        }

        // 2. RATE LIMIT CHECK
        const status = loginLimitCache.get(ip);
        if (status && status.lockUntil > now) {
          const secondsLeft = Math.ceil((status.lockUntil - now) / 1000);
          // Kita kirim kode error khusus yang nanti di-parse di frontend
          throw new CustomAuthError(`LOCKED:${secondsLeft}`);
        }

        if (!email || !password) return null;
        const normalizedEmail = email.toLowerCase();

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail }, include: { accounts: true } });
        if (!user) return null;

        if (!user.password) {
          const provider = user.accounts[0].provider;
          throw new CustomAuthError(`You have an account with ${provider}. Please sign in with ${provider}`);
        }

        const passwordMatch = compareSync(password, user.password);
        if (!passwordMatch) {
          const currentAttempts = (status?.attempts || 0) + 1;

          if (currentAttempts >= 3) {
            const lockDuration = 1 * 60 * 1000; // 15 menit
            loginLimitCache.set(ip, { attempts: currentAttempts, lockUntil: now + lockDuration });
            throw new CustomAuthError(`LOCKED:${lockDuration / 1000}`);
          }

          loginLimitCache.set(ip, { attempts: currentAttempts, lockUntil: 0 });
          // Mengirim pesan sisa percobaan
          throw new CustomAuthError(`Invalid email or password.`);
        }

        if (user.emailVerified === null || !user.emailVerified) {
          try {
            await fetch(`${baseUrl}/api/emails/send-email-verification`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, userId: user.id }),
            });
          } catch (error) {
            console.error("Gagal kirim email verifikasi:", error);
          }
          // throw new CustomAuthError("Please verify your email. We've sent a new link.");
        }

        // LOGIN SUKSES
        loginLimitCache.delete(ip);
        return user;
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, account, user, trigger }) {
      if (user) {
        if (account?.provider !== "credentials" && user.emailVerified === null) {
          const updatedUser = await prisma.user.update({
            where: { id: user.id as string },
            data: { emailVerified: new Date() },
            select: { emailVerified: true, role: true, phone: true },
          });

          user.emailVerified = updatedUser.emailVerified;
          user.role = updatedUser.role;
        }

        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.phone = user.phone;
        token.emailVerified = user.emailVerified;
        token.pendingEmail = user.pendingEmail;
        return token;
      }

      if (trigger === "update" || !token.id) {
        const latestUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (latestUser) {
          token.id = latestUser.id;
          token.name = latestUser.name;
          token.email = latestUser.email;
          token.role = latestUser.role;
          token.phone = latestUser.phone;
          token.emailVerified = latestUser.emailVerified;
          token.pendingEmail = latestUser.pendingEmail;
        }
      }

      return token;
    },
    async session({ session, token }) {
      const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
      session.user.id = dbUser?.id as string;
      session.user.name = dbUser?.name;
      session.user.email = dbUser?.email as string;
      session.user.role = dbUser?.role;
      session.user.phone = dbUser?.phone;
      session.user.emailVerified = dbUser?.emailVerified as Date | null;
      session.user.pendingEmail = dbUser?.pendingEmail;
      return session;
    },
    // async signIn({ user, account }) {
    //   const prisma = (await import("@/lib/prisma")).default;
    //   if (account?.provider !== "credentials") {
    //     const existingUser = await prisma.user.findUnique({ where: { email: user.email as string } });

    //     if (existingUser) {
    //       const existingAccount = await prisma.account.findFirst({
    //         where: { provider: account?.provider, providerAccountId: account?.providerAccountId },
    //       });

    //       if (!existingAccount) {
    //         await prisma.account.create({
    //           data: {
    //             userId: existingUser.id,
    //             provider: account?.provider as string,
    //             providerAccountId: account?.providerAccountId as string,
    //             type: account?.type as string,
    //             access_token: account?.access_token as string,
    //             token_type: account?.token_type,
    //             scope: account?.scope,
    //           },
    //         });
    //       }
    //       return true;
    //     }
    //   }
    //   return true;
    // },
  },
} satisfies NextAuthConfig;

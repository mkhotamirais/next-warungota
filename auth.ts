import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    // GitHub,
    // Credentials({
    //   credentials: {
    //     email: {},
    //     password: {},
    //   },
    //   authorize: async (credentials) => {
    //     const validatedFields = SigninSchema.safeParse(credentials);

    //     if (!validatedFields.success) return null;

    //     const { email, password } = validatedFields.data;
    //     const user = await prisma.user.findUnique({ where: { email } });
    //     if (!user || !user.password) {
    //       return null;
    //     }
    //     const passwordMatch = compareSync(password, user.password);
    //     if (!passwordMatch) return null;

    //     return user;
    //   },
    // }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      return session;
    },
    // async signIn({ user, account }) {
    //   // Kalau login bukan pakai credentials (contohnya Google/GitHub)
    //   if (account?.provider !== "credentials") {
    //     const existingUser = await prisma.user.findUnique({
    //       where: { email: user.email as string },
    //     });

    //     if (existingUser) {
    //       // Cek apakah account provider ini sudah ada di tabel accounts
    //       const existingAccount = await prisma.account.findFirst({
    //         where: {
    //           provider: account?.provider,
    //           providerAccountId: account?.providerAccountId,
    //         },
    //       });

    //       if (!existingAccount) {
    //         // Link akun provider baru ke user lama
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

    //       return true; // izinkan login
    //     }
    //   }
    //   return true;
    // },
  },
});

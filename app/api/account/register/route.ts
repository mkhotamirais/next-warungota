import { baseUrl } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/auth";
import { hashSync } from "bcrypt-ts";
import * as z from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const valdatedFields = registerSchema.safeParse(body);

    if (!valdatedFields.success) {
      return Response.json(
        { ok: false, message: "Invalid fields!", errors: z.treeifyError(valdatedFields.error).properties },
        { status: 400 },
      );
    }

    const { name, email, password } = valdatedFields.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ ok: false, message: `Email '${email}' already registered.` }, { status: 409 });
    }

    const hashedPassword = hashSync(password, 10);
    await prisma.user.create({ data: { name, email, password: hashedPassword, emailVerified: null } });
    // await fetch(`${baseUrl}/api/emails/send-email-verification`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, userId: user.id, callbackUrl: "/user" }),
    // });

    return Response.json({ ok: true, message: "Registration successful." }, { status: 201 });
  } catch (error) {
    console.log("error", error);
  }
}

// import { sendEmailVerification } from "@/actions/account";
// import prisma from "@/lib/prisma";
// import { SignupSchema } from "@/lib/zod";
// import { hashSync } from "bcrypt-ts";
// import { NextResponse } from "next/server";
// import z from "zod";

// export async function POST(req: Request) {
//   const body = await req.json();
//   const validatedFields = SignupSchema.safeParse(body);

//   if (!validatedFields.success) {
//     return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
//   }

//   const { name, email, password } = validatedFields.data;

//   try {
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     console.log(existingUser);
//     if (existingUser) {
//       return Response.json({ error: `Email '${email}' sudah terdaftar.` }, { status: 409 });
//     }

//     const hashedPassword = hashSync(password, 10);
//     const newUser = { name, email, password: hashedPassword, emailVerified: null };

//     const user = await prisma.user.create({ data: newUser });
//     await sendEmailVerification(newUser.email, user.id);

//     return Response.json({ message: "Pendaftaran berhasil." }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
//   }
// }

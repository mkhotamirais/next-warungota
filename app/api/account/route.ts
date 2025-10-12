import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountDataSchema } from "@/lib/zod";
import z from "zod";
import { Prisma } from "@prisma/client";
import { sendEmailChangeVerification } from "@/actions/send-verification";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const validatedFields = AccountDataSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
  }

  const { name, email: newEmail, phone: inputPhone } = validatedFields.data;

  const normalizeValue = (value: string | null | undefined): string | null | undefined => {
    if (typeof value === "string" && value.trim() === "") {
      return null;
    }
    return value;
  };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const updates: Prisma.UserUpdateInput = {};
    let emailChangePending = false;

    const normalizedInputPhone = normalizeValue(inputPhone);
    const normalizedUserPhone = normalizeValue(user.phone);

    if (name !== user.name) {
      updates.name = name;
    }

    if (normalizedInputPhone !== normalizedUserPhone) {
      if (normalizedInputPhone !== null) {
        const duplicatePhoneNumber = await prisma.user.findFirst({
          where: {
            phone: normalizedInputPhone,
            id: { not: userId },
          },
        });

        if (duplicatePhoneNumber) {
          return Response.json({ error: "Phone number is already in use" }, { status: 400 });
        }
      }

      updates.phone = normalizedInputPhone;
    }

    if (newEmail && newEmail !== user.email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: { OR: [{ email: newEmail }, { pendingEmail: newEmail }] },
      });

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        return Response.json({ error: "Email is already in use or pending verification" }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          pendingEmail: newEmail,
          emailVerified: null,
        },
      });

      emailChangePending = true;

      await sendEmailChangeVerification(newEmail, userId);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: updates });
    }

    if (emailChangePending) {
      return Response.json(
        { message: "Verification email sent to new address. Please check your inbox." },
        { status: 200 }
      );
    }

    return Response.json({ message: "Account updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("API Account PUT error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

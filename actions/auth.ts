"use server";

import { SigninSchema, SignupSchema } from "@/lib/zod";
import z from "zod";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";

export const signUp = async (prevState: unknown, formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = SignupSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const error = z.treeifyError(validatedFields.error);
    return { errors: error?.properties, values: rawData };
  }

  try {
    const { name, email, password } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { status: "error", message: "Email already registered", values: rawData };
    }
    const hashedPassword = hashSync(password, 10);

    await prisma.user.create({ data: { name, email, password: hashedPassword } });
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Failed to create user" };
  }
  redirect("/signin");
};

export const signInCredential = async (prevState: unknown, formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = SigninSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: z.treeifyError(validatedFields.error), values: rawData };
  }

  const { email, password } = validatedFields.data;

  try {
    const cookieStore = await cookies();
    const lastUrl = cookieStore.get("last_visited")?.value || "/";

    await signIn("credentials", { email, password, redirectTo: lastUrl });
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid email or password", values: rawData };
        default:
          return { message: "An unexpected error occurred", values: rawData };
      }
    }
    throw error;
  }
};

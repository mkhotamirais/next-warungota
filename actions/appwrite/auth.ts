"use server";

import { account, ID } from "@/config/appwrite";
import { loginSchema, registerSchema } from "@/lib/schemas/auth";
import { AppwriteException } from "appwrite";
import z from "zod";

export const register = async (values: z.infer<typeof registerSchema>) => {
  try {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
      return { ok: false, message: "Invalid fields!" };
    }

    const { name, email, password } = values;
    await account.create({ userId: ID.unique(), email, password, name });
    return { ok: true, message: "Regiseter new user success" };
  } catch (error) {
    if (error instanceof AppwriteException) {
      const res = JSON.parse(error.response);
      return { ok: false, message: res.message };
    }
    return { ok: false, message: "Something went wrong!" };
  }
};

export const login = async (valus: z.infer<typeof loginSchema>) => {
  try {
    const validatedFields = loginSchema.safeParse(valus);

    if (!validatedFields.success) {
      return { ok: false, message: "Invalid fields!" };
    }

    const { email, password } = valus;
    await account.createEmailPasswordSession({ email, password });
    return { ok: true, message: "Login success" };
  } catch (error) {
    if (error instanceof AppwriteException) {
      const res = JSON.parse(error.response);
      return { ok: false, message: res.message };
    }
    return { ok: false, message: "Something went wrong!" };
  }
};

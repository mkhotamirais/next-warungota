import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Helper
export const adminOnly = async () => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "admin") redirect("/dashboard");
};

export const adminOrEditor = async () => {
  const session = await auth();
  if (!session || !session.user || (session.user.role !== "admin" && session.user.role !== "editor"))
    redirect("/dashboard");
};

// Users
export const getUsers = async () => {
  await adminOnly();

  try {
    const users = await prisma.user.findMany({
      select: { role: true, id: true, name: true, email: true, phone: true },
    });
    return users;
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async () => {
  const session = await auth();
  const id = session?.user?.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true, id: true, name: true, email: true, phone: true },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (id: string) => {
  await adminOnly();
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    const usersWithNoPassword = { ...user, password: undefined };
    return usersWithNoPassword;
  } catch (error) {
    console.log(error);
  }
};

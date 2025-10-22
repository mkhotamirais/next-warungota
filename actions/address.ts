import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getUserAddresses = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return addresses;
};

export const getUserAddressById = async (id: string) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const address = await prisma.address.findFirst({ where: { userId, id }, orderBy: { updatedAt: "desc" } });
  return address;
};

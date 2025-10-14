import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getUserAddresses = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return addresses;
};

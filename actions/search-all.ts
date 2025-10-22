import { prisma } from "@/lib/prisma";

export const searchAll = async (key: string) => {
  try {
    const products = await prisma.product.findMany({
      where: { name: { contains: key, mode: "insensitive" } },
      select: { id: true, name: true, imageUrl: true, price: true },
    });
    const blogs = await prisma.blog.findMany({
      where: { title: { contains: key, mode: "insensitive" } },
      select: { id: true, title: true, imageUrl: true },
    });

    const results = { products, blogs };
    return results;
  } catch (error) {
    console.log(error);
  }
};

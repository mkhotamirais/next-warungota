import { prisma } from "@/lib/prisma";

export const searchAll = async (key: string) => {
  try {
    const products = await prisma.product.findMany({
      where: { name: { contains: key, mode: "insensitive" } },
      orderBy: { name: "asc" },
      include: {
        ProductCategory: { select: { name: true, slug: true } },
        User: { select: { name: true } },
      },
    });
    const blogs = await prisma.blog.findMany({
      where: { title: { contains: key, mode: "insensitive" } },
      orderBy: { title: "asc" },
      include: {
        BlogCategory: { select: { name: true, slug: true } },
        User: { select: { name: true } },
      },
    });

    const results = { products, blogs };
    return results;
  } catch (error) {
    console.log(error);
  }
};

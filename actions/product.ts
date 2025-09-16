import { prisma } from "@/lib/prisma";

export const getProductCategories = async () => {
  const categories = await prisma.productCategory.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  return categories;
};

export const getProductCategoryBySlug = async (slug: string) => {
  const category = await prisma.productCategory.findUnique({ where: { slug } });
  return category;
};

interface GetProductParams {
  limit?: number;
  page?: number;
  excludeSlug?: string;
  categorySlug?: string;
  userId?: string;
}

export const getProducts = async ({
  limit = 8,
  // page = 1, // Default ke halaman 1
  excludeSlug,
  categorySlug,
  userId,
}: GetProductParams = {}) => {
  const whereClause: {
    slug?: { not: string };
    ProductCategory?: { slug: string };
    userId?: string;
  } = {};

  if (excludeSlug) whereClause.slug = { not: excludeSlug };
  if (categorySlug) whereClause.ProductCategory = { slug: categorySlug };
  if (userId) whereClause.userId = userId;

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
    include: {
      ProductCategory: { select: { name: true, slug: true } },
      User: { select: { name: true } },
    },
  });

  return products;
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { ProductCategory: { select: { name: true, slug: true } }, User: { select: { name: true } } },
  });
  return product;
};

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
  keyword?: string;
}

export const getProducts = async ({
  limit = 8,
  page = 1,
  excludeSlug,
  categorySlug,
  userId,
  keyword = "",
}: GetProductParams = {}) => {
  const whereClause: {
    slug?: { not: string };
    ProductCategory?: { slug: string };
    userId?: string;
    name?: { contains: string; mode: "insensitive" };
  } = {};

  if (excludeSlug) whereClause.slug = { not: excludeSlug };
  if (categorySlug) whereClause.ProductCategory = { slug: categorySlug };
  if (userId) whereClause.userId = userId;
  if (keyword) whereClause.name = { contains: keyword, mode: "insensitive" };

  const totalProductsCount = await prisma.product.count({ where: whereClause });

  const skip = (page - 1) * limit;

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { updatedAt: "desc" },
    take: limit,
    skip: skip,
    include: {
      ProductCategory: { select: { name: true, slug: true } },
      User: { select: { name: true } },
      VariationType: { select: { id: true, name: true } },
      ProductVariant: {
        include: {
          Options: {
            select: {
              VariationOption: {
                select: { id: true, value: true, VariationType: { select: { id: true, name: true } } },
              },
            },
          },
        },
      },
    },
  });

  const totalPages = Math.ceil(totalProductsCount / limit);

  return { products, totalProductsCount, totalPages };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ProductCategory: { select: { name: true, slug: true } },
      User: { select: { name: true } },
      VariationType: { select: { id: true, name: true } },
      ProductVariant: {
        include: { Options: { include: { VariationOption: { include: { VariationType: true } } } }, Product: true },
      },
    },
  });
  return product;
};

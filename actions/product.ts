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
  sortPrice?: "asc" | "desc" | null;
  minPrice?: number;
  maxPrice?: number;
}

export const getProducts = async ({
  limit = 8,
  page = 1,
  excludeSlug,
  categorySlug,
  userId,
  keyword = "",
  sortPrice,
  minPrice,
  maxPrice,
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
      ProductVariant: { select: { price: true } },
    },
  });

  const totalPages = Math.ceil(totalProductsCount / limit);

  const productsWithPriceRange = products.map((product) => {
    const prices = product.ProductVariant.map((variant) => variant.price);

    const productMinPrice = prices.length === 0 ? null : Math.min(...prices);

    return { ...product, productMinPrice };
  });

  let filteredProducts = productsWithPriceRange;

  if (minPrice || maxPrice) {
    filteredProducts = productsWithPriceRange.filter((product) => {
      const productPrice = product.productMinPrice;

      if (productPrice === null) {
        return false;
      }

      const isAboveMin = minPrice ? productPrice >= minPrice : true;

      const isBelowMax = maxPrice ? productPrice <= maxPrice : true;

      return isAboveMin && isBelowMax;
    });
  }

  let appliedProducts = filteredProducts;

  if (sortPrice) {
    const sortMultiplier = sortPrice === "asc" ? 1 : -1;
    const HUGE_VALUE = Infinity;

    appliedProducts = [...filteredProducts].sort((a, b) => {
      const aPrice = a.productMinPrice ?? HUGE_VALUE;
      const bPrice = b.productMinPrice ?? HUGE_VALUE;

      const priceDifference = aPrice - bPrice;
      return priceDifference * sortMultiplier;
    });
  }

  return { products: appliedProducts, totalProductsCount, totalPages };
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

import { prisma } from "@/lib/prisma";

export const getBlogCategories = async () => {
  const categories = await prisma.blogCategory.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  return categories;
};

export const getBlogCategoryBySlug = async (slug: string) => {
  const category = await prisma.blogCategory.findUnique({ where: { slug } });
  return category;
};

interface GetBlogParams {
  limit?: number;
  page?: number; // Menggunakan 'page' untuk paginasi berbasis skip
  excludeSlug?: string;
  categorySlug?: string;
  userId?: string;
}

export const getBlogs = async ({
  limit = 8,
  page = 1, // Default ke halaman 1
  excludeSlug,
  categorySlug,
  userId,
}: GetBlogParams = {}) => {
  const whereClause: {
    slug?: { not: string };
    BlogCategory?: { slug: string };
    userId?: string;
  } = {};

  if (excludeSlug) whereClause.slug = { not: excludeSlug };
  if (categorySlug) whereClause.BlogCategory = { slug: categorySlug };
  if (userId) whereClause.userId = userId; // Menghitung total blog yang cocok dengan filter

  const totalBlogsCount = await prisma.blog.count({
    where: whereClause,
  }); // Menghitung berapa banyak data yang harus dilewati

  const skip = (page - 1) * limit;

  const blogs = await prisma.blog.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: skip,
    include: {
      BlogCategory: { select: { name: true, slug: true } },
      User: { select: { name: true } },
    },
  }); // Menghitung total halaman

  const totalPages = Math.ceil(totalBlogsCount / limit);

  return { blogs, totalBlogsCount, totalPages };
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { BlogCategory: { select: { name: true, slug: true } }, User: { select: { name: true } } },
  });
  return blog;
};

import { prisma } from "./prisma";
import { auth } from "@/auth";
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

// Blog Category
export const getBlogCategories = async () => {
  const categories = await prisma.blogCategory.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  return categories;
};

export const getBlogCategoryBySlug = async (slug: string) => {
  const category = await prisma.blogCategory.findUnique({ where: { slug } });
  return category;
};

// Blog
export const getBlogs = async (limit?: number, excludeSlug?: string, categorySlug?: string) => {
  const whereClause: { slug?: { not: string }; BlogCategory?: { slug: string } } = {};

  if (excludeSlug) whereClause.slug = { not: excludeSlug };
  if (categorySlug) whereClause.BlogCategory = { slug: categorySlug };

  const blogs = await prisma.blog.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
    include: {
      BlogCategory: { select: { name: true, slug: true } },
      User: { select: { name: true } },
    },
  });

  return blogs;
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { BlogCategory: { select: { name: true, slug: true } }, User: { select: { name: true } } },
  });
  return blog;
};

export const getBlogByUserId = async () => {
  const session = await auth();
  const id = session?.user?.id;
  const blog = await prisma.blog.findMany({
    include: { BlogCategory: { select: { name: true, slug: true } }, User: { select: { name: true } } },
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });
  return blog;
};

// Product Category
export const getProductCategories = async () => {
  const categories = await prisma.productCategory.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  return categories;
};

export const getProductCategoryBySlug = async (slug: string) => {
  const category = await prisma.productCategory.findUnique({ where: { slug } });
  return category;
};

// Product Category
export const getProductTags = async () => {
  const tags = await prisma.productTag.findMany({ orderBy: { createdAt: "desc" } });
  return tags;
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

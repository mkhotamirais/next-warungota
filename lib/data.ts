import { prisma } from "./prisma";

export const getBlogCategories = async () => {
  const categories = await prisma.blogCategory.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  return categories;
};

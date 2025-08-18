// "use server";

// import { prisma } from "@/lib/prisma";

// export const getBlogCategories = async () => {
//   const categories = await prisma.blogCategory.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
//   return categories;
// };

// export const getBlogCategoryById = async (id: string) => {
//   const category = await prisma.blogCategory.findUnique({ where: { id } });
//   return category;
// };

// export const createBlogCategory = async (prevState: unknown, formData: FormData) => {

//   const category = await prisma.blogCategory.create({ data: { name } });
//   return category;
// };

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BlogCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const categoryToDelete = await prisma.blogCategory.findUnique({ where: { id } });
  if (!categoryToDelete) {
    return Response.json({ error: "Blog category not found" }, { status: 404 });
  }

  if (categoryToDelete.isDefault) {
    return Response.json({ error: "Default blog category cannot be deleted" }, { status: 400 });
  }

  try {
    const postCount = await prisma.blog.count({
      where: { categoryId: id },
    });

    if (postCount > 0) {
      const defaultCategory = await prisma.blogCategory.findFirst({ where: { isDefault: true } });

      if (!defaultCategory) {
        return Response.json({ error: "Default category not found" }, { status: 500 });
      }

      await prisma.$transaction(async (tx) => {
        await tx.blog.updateMany({ where: { categoryId: id }, data: { categoryId: defaultCategory.id } });
        await tx.blogCategory.delete({ where: { id } });
      });

      revalidatePath("/dashboard/blog-category");

      return Response.json({
        message: `Blog category "${categoryToDelete.name}" deleted successfully. ${postCount} associated posts have been moved to "${defaultCategory.name}".`,
      });
    } else {
      await prisma.blogCategory.delete({ where: { id } });
      revalidatePath("/dashboard/blog-category");
      return Response.json({ message: `Blog category "${categoryToDelete.name}" deleted successfully.` });
    }
  } catch (error) {
    console.log(error);
  }
};

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const rawData = await req.json();
  const validatedFields = BlogCategorySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  const { name, slug } = validatedFields.data;
  try {
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
      select: { isDefault: true, name: true },
    });

    if (!existingCategory) return Response.json({ error: "Category not found" }, { status: 404 });
    if (existingCategory.isDefault) {
      return Response.json({ error: "Default blog category cannot be updated" }, { status: 403 });
    }

    const result = await prisma.blogCategory.update({ where: { id }, data: { name, slug } });
    revalidatePath("/dashboard/blog-category");

    return Response.json({ message: `Blog category "${result.name}" updated successfully` });
  } catch (error) {
    console.log(error);
  }
};

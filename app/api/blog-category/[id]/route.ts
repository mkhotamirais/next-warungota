import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BlogCategorySchema } from "@/lib/zod";
import z from "zod";

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const category = await prisma.blogCategory.findUnique({ where: { id }, select: { isDefault: true } });
  if (category?.isDefault) return Response.json({ error: "Default blog category cannot be deleted" });

  try {
    const result = await prisma.blogCategory.delete({ where: { id } });
    return Response.json({ message: `Blog category "${result.name}" deleted successfully` });
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

  const { name } = validatedFields.data;
  try {
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
      select: { isDefault: true, name: true },
    });

    if (!existingCategory) return Response.json({ error: "Category not found" }, { status: 404 });
    if (existingCategory.isDefault) {
      return Response.json({ error: "Default blog category cannot be updated" }, { status: 403 });
    }

    const result = await prisma.blogCategory.update({ where: { id }, data: { name, slug } });
    return Response.json({ message: `Blog category "${result.name}" updated successfully` });
  } catch (error) {
    console.log(error);
  }
};

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductTagSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const tagToDelete = await prisma.productTag.findUnique({ where: { id } });
  if (!tagToDelete) {
    return Response.json({ error: "Product tag not found" }, { status: 404 });
  }

  try {
    await prisma.productTag.delete({ where: { id } });
    revalidatePath("/dashboard/product-tag");
    revalidatePath("/dashboard/product/create-product");

    return Response.json({ message: `Product tag "${tagToDelete.name}" deleted successfully.` });
  } catch (error) {
    console.log(error);
  }
};

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const rawData = await req.json();
  const validatedFields = ProductTagSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  const { name, slug } = validatedFields.data;
  try {
    const existingTag = await prisma.productTag.findUnique({ where: { id } });
    if (!existingTag) return Response.json({ error: "Tag not found" }, { status: 404 });

    const result = await prisma.productTag.update({ where: { id }, data: { name, slug } });
    revalidatePath("/dashboard/product-tag");
    revalidatePath("/dashboard/product/create-product");

    return Response.json({ message: `Product tag "${result.name}" updated successfully` });
  } catch (error) {
    console.log(error);
  }
};

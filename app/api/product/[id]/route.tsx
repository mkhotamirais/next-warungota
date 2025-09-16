import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/zod";
import { del, put } from "@vercel/blob";
import z from "zod";

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session || !session.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;
  const id = (await params).id;
  const role = session.user.role as string;

  const product = await prisma.product.findUnique({ where: { id }, select: { userId: true } });
  if (role !== "admin" && (role !== "editor" || product?.userId !== userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rawData = await req.json();
  const imageUrl = rawData.imageUrl;

  if (imageUrl) {
    await del(imageUrl);
  }

  try {
    const result = await prisma.product.delete({ where: { id } });
    return Response.json({ message: `Product "${result.name}" deleted successfully` });
  } catch (error) {
    console.log(error);
  }
};

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session || !session.user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;
  const id = (await params).id;
  const role = session.user.role as string;

  const currentProduct = await prisma.product.findUnique({ where: { id }, select: { userId: true, imageUrl: true } });
  if (role !== "admin" && (role !== "editor" || currentProduct?.userId !== userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const file = formData.get("image") as File | null;
  const image = file instanceof File && file.size > 0 ? file : null;
  const tags = formData.getAll("tags");

  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image, tags };

  const validatedFields = ProductSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  const { name, price, stock, slug, description } = validatedFields.data;
  let categoryId = validatedFields.data.categoryId;
  try {
    const existingCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } });

    if (!existingCategory) {
      const defaultCategory = await prisma.productCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory)
        return Response.json({ error: "Selected category was deleted and no default category found" }, { status: 404 });
      categoryId = defaultCategory.id;
    }
    const existingProduct = await prisma.product.findFirst({ where: { name } });

    if (existingProduct && existingProduct.id !== id) {
      return Response.json({ error: "Product title already exists" }, { status: 409 });
    }

    let imageUrl = currentProduct?.imageUrl || "";
    if (file && file.size > 0) {
      if (currentProduct?.imageUrl) {
        await del(currentProduct.imageUrl);
      }
      const blob = await put(Date.now() + "-" + file?.name, file, { access: "public", multipart: true });
      imageUrl = blob.url;
    }

    await prisma.product.update({
      data: { name, price, stock, description, slug, imageUrl, categoryId },
      where: { id },
    });
    return Response.json({ message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
  }
};

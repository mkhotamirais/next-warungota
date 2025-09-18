import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/zod";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || (session.user.role !== "admin" && session.user.role !== "editor"))
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

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

  let imageUrl;
  if (file && file.size > 0) {
    const blob = await put(Date.now() + "-" + file?.name, file, { access: "public", multipart: true });
    imageUrl = blob.url;
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

    if (existingProduct) {
      return Response.json({ error: "Product title already exists" }, { status: 409 });
    }

    await prisma.product.create({
      data: { name, slug, price, stock, description, imageUrl, userId, categoryId },
    });
    revalidatePath("/");
    revalidatePath("/product");
    revalidatePath("/product/page/[page]", "page");
    return Response.json({ message: "Product created successfully" });
  } catch (error) {
    console.log(error);
  }
};

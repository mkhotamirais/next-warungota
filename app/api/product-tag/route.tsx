import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductTagSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const rawData = await req.json();
  const validatedFields = ProductTagSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  const { name, slug } = validatedFields.data;

  if (await prisma.productTag.findUnique({ where: { slug } })) {
    return Response.json({ error: `Product tag "${name}" already exists` }, { status: 409 });
  }

  try {
    await prisma.productTag.create({ data: { name, slug } });
    revalidatePath("/dashboard/product-tag");
    revalidatePath("/dashboard/product/create-product");
    return Response.json({ message: `Product tag "${name}" created successfully` });
  } catch (error) {
    console.log(error);
  }
};

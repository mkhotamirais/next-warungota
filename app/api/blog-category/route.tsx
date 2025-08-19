import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BlogCategorySchema } from "@/lib/zod";
import z from "zod";

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const rawData = await req.json();
  const validatedFields = BlogCategorySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  const { name } = validatedFields.data;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  if (await prisma.blogCategory.findUnique({ where: { slug } })) {
    return Response.json({ error: `Blog category "${name}" already exists` }, { status: 409 });
  }

  try {
    await prisma.blogCategory.create({ data: { name, slug } });
    return Response.json({ message: `Blog category "${name}" created successfully` });
  } catch (error) {
    console.log(error);
  }
};

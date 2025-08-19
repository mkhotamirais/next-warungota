import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BlogSchema } from "@/lib/zod";
import { put } from "@vercel/blob";
import z from "zod";

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || (session.user.role !== "admin" && session.user.role !== "editor"))
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const formData = await req.formData();

  const file = formData.get("image") as File | null;
  const rawData = Object.fromEntries(formData.entries());

  const dataForValidation = { ...rawData, image: file instanceof File && file.size > 0 ? file : null };

  const validatedFields = BlogSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  let imageUrl = "";
  if (file && file.size > 0) {
    const blob = await put(Date.now() + "-" + file?.name, file, { access: "public", multipart: true });
    imageUrl = blob.url;
  }

  const { title, slug, content, categoryId } = validatedFields.data;
  const existingBlog = await prisma.blog.findFirst({ where: { title } });

  if (existingBlog) {
    return Response.json({ error: "Blog title already exists" }, { status: 409 });
  }

  try {
    await prisma.blog.create({ data: { title, slug, content, imageUrl, categoryId, userId } });
    return Response.json({ message: "Blog created successfully" });
  } catch (error) {
    console.log(error);
  }
};

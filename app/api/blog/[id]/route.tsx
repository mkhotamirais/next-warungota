import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BlogSchema } from "@/lib/zod";
import { del, put } from "@vercel/blob";
import z from "zod";

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session || !session.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;
  const id = (await params).id;
  const role = session.user.role as string;

  const blog = await prisma.blog.findUnique({ where: { id }, select: { userId: true } });
  if (role !== "admin" && (role !== "editor" || blog?.userId !== userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rawData = await req.json();
  const imageUrl = rawData.imageUrl;

  if (imageUrl) {
    await del(imageUrl);
  }

  try {
    const result = await prisma.blog.delete({ where: { id } });
    return Response.json({ message: `Blog "${result.title}" deleted successfully` });
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

  const currentBlog = await prisma.blog.findUnique({ where: { id }, select: { userId: true, imageUrl: true } });
  if (role !== "admin" && (role !== "editor" || currentBlog?.userId !== userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const file = formData.get("image") as File | null;
  const rawData = Object.fromEntries(formData.entries());

  const dataForValidation = { ...rawData, image: file instanceof File && file.size > 0 ? file : null };

  const validatedFields = BlogSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  const { title, slug, content, categoryId } = validatedFields.data;
  const existingBlog = await prisma.blog.findFirst({ where: { title } });

  if (existingBlog && existingBlog.id !== id) {
    return Response.json({ error: "Blog title already exists" }, { status: 409 });
  }

  let imageUrl = currentBlog?.imageUrl || "";
  if (file && file.size > 0) {
    if (currentBlog?.imageUrl) {
      await del(currentBlog.imageUrl);
    }
    const blob = await put(Date.now() + "-" + file?.name, file, { access: "public", multipart: true });
    imageUrl = blob.url;
  }

  try {
    await prisma.blog.update({ data: { title, slug, content, imageUrl, categoryId }, where: { id } });
    return Response.json({ message: "Blog updated successfully" });
  } catch (error) {
    console.log(error);
  }
};

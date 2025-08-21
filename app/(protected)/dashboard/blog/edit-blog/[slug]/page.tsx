import { redirect } from "next/navigation";
import { Suspense } from "react";
import EditBlogForm from "./EditBlogForm";
import { getBlogBySlug, getBlogCategories } from "@/lib/data";
import Load from "@/components/fallbacks/Load";

export default async function EditBlog({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const [blogCategories, blog] = await Promise.all([getBlogCategories(), getBlogBySlug(slug)]);

  if (!blogCategories?.length || !blog) redirect("/dashboard/blog-category");

  return (
    <Suspense fallback={<Load />}>
      <EditBlogForm blogCategories={blogCategories} blog={blog} />
    </Suspense>
  );
}

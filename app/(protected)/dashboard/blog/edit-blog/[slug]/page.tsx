import { redirect } from "next/navigation";
import { Suspense } from "react";
import EditBlogForm from "./EditBlogForm";
import Load from "@/components/fallbacks/Load";
import { getBlogBySlug, getBlogCategories } from "@/actions/blog";

export default async function EditBlog({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const blogCategories = await getBlogCategories();
  const blog = await getBlogBySlug(slug);

  if (!blogCategories?.length || !blog) redirect("/dashboard/blog-category");

  return (
    <Suspense fallback={<Load />}>
      <EditBlogForm blogCategories={blogCategories} blog={blog} />
    </Suspense>
  );
}

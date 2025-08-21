import { getBlogCategories } from "@/lib/data";
import CreateBlogForm from "./CreateBlogForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Load from "@/components/fallbacks/Load";

export default async function CreateBlog() {
  const blogCategories = await getBlogCategories();
  if (!blogCategories?.length) redirect("/dashboard/blog-category");

  return (
    <Suspense fallback={<Load />}>
      <CreateBlogForm blogCategories={blogCategories} />
    </Suspense>
  );
}

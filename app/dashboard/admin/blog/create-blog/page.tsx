import CreateBlogForm from "./CreateBlogForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Load from "@/components/fallbacks/Load";
import { getBlogCategories } from "@/actions/blog";

export default async function CreateBlog() {
  const blogCategories = await getBlogCategories();
  if (!blogCategories?.length) redirect("/dashboard/admin/blog-category");

  return (
    <Suspense fallback={<Load />}>
      <CreateBlogForm blogCategories={blogCategories} />
    </Suspense>
  );
}

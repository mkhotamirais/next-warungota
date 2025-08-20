import { getBlogCategories } from "@/lib/data";
import CreateBlogForm from "./CreateBlogForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function CreateBlog() {
  const blogCategories = await getBlogCategories();
  if (!blogCategories?.length) redirect("/dashboard/blog-category");

  return (
    <div>
      {blogCategories?.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
      <Suspense fallback={<div>Loading...</div>}>
        <CreateBlogForm blogCategories={blogCategories} />
      </Suspense>
    </div>
  );
}

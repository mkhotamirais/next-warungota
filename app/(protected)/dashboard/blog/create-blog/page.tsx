import { getBlogCategories } from "@/lib/data";
import CreateBlogForm from "./CreateBlogForm";
import { redirect } from "next/navigation";

export default async function CreateBlog() {
  const blogCategories = await getBlogCategories();
  if (!blogCategories?.length) redirect("/admin/blog-category");

  return <CreateBlogForm blogCategories={blogCategories} />;
}

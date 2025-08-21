import React, { Suspense } from "react";
import BlogCategoryList from "./List";
import { getBlogCategories } from "@/lib/data";
import Load from "@/components/fallbacks/Load";

export default async function BlogCategory() {
  const blogCategories = await getBlogCategories();

  if (!blogCategories?.length) return <h2 className="h2 container">No Blog Category</h2>;

  return (
    <Suspense fallback={<Load />}>
      <BlogCategoryList blogCategories={blogCategories} />
    </Suspense>
  );
}

import React, { Suspense } from "react";
import BlogCategoryList from "./List";
import { getBlogCategories } from "@/lib/data";

export default async function BlogCategory() {
  const blogCategories = await getBlogCategories();

  if (!blogCategories?.length) return <h2 className="h2 container">No Blog Category</h2>;

  return (
    <>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <BlogCategoryList blogCategories={blogCategories} />
      </Suspense>
    </>
  );
}

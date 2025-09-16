import React, { Suspense } from "react";
import BlogCategoryList from "./List";
import Load from "@/components/fallbacks/Load";
import Create from "./Create";
import { getBlogCategories } from "@/actions/blog";

export default async function BlogCategory() {
  const blogCategories = await getBlogCategories();
  return (
    <>
      <Create />
      <Suspense fallback={<Load />}>
        <BlogCategoryList blogCategories={blogCategories} />
      </Suspense>
    </>
  );
}

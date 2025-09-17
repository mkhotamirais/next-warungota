import { getBlogs } from "@/actions/blog";
import BlogCard from "@/components/sections/BlogCard";
import Pagination from "@/components/ui/Pagination";
import React from "react";

export default async function List({ page }: { page: number }) {
  const { blogs, totalPages } = await getBlogs({ page, limit: 3 });

  return (
    <>
      <div className="">
        {blogs?.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </>
  );
}

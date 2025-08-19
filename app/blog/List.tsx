import BlogCard1 from "@/components/sections/BlogCard1";
import BlogCard2 from "@/components/sections/BlogCard2";
import { BlogProps } from "@/types/types";
import React from "react";

export default function List({ blogs }: { blogs: BlogProps[] | undefined | null }) {
  return (
    <div className="flex">
      <div className="w-3/4">
        <div className="hidden sm:block">
          {blogs?.map((blog) => (
            <BlogCard2 key={blog.id} blog={blog} />
          ))}
        </div>
        <div className="block sm:hidden">
          {blogs?.map((blog) => (
            <BlogCard1 key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
      <div className="w-1/4">right</div>
    </div>
  );
}

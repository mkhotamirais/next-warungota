import BlogCard from "@/components/sections/BlogCard";
import { BlogProps } from "@/types/types";
import React from "react";

interface ListProps {
  blogs: BlogProps[] | undefined | null;
}

export default function List({ blogs }: ListProps) {
  return (
    <div className="">
      {blogs?.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

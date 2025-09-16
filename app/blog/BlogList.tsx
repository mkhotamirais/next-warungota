import BlogCard from "@/components/sections/BlogCard";
import { BlogProps } from "@/types/types";
import React from "react";

interface BlogListProps {
  blogs: BlogProps[] | undefined | null;
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="">
      {blogs?.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

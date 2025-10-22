import BlogCardForAll from "@/components/sections/BlogCardForAll";
import { BlogProps } from "@/types/types";
import React from "react";

interface ListProps {
  blogs: BlogProps[] | undefined | null;
}

export default function List({ blogs }: ListProps) {
  return (
    <div className="grid-all-list">
      {blogs?.map((blog) => (
        <BlogCardForAll key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

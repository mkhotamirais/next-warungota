import BlogCard1 from "@/components/sections/BlogCard1";
import BlogCard2 from "@/components/sections/BlogCard2";
import { BlogProps } from "@/types/types";
import React from "react";
import ListSide from "./ListSide";

export default function List({ blogs }: { blogs: BlogProps[] | undefined | null }) {
  if (!blogs?.length) return <h2 className="h2">No Blog Found</h2>;

  return (
    <>
      <div className="hidden sm:flex flex-col lg:flex-row items-start gap-8">
        <div className="w-full lg:w-3/4">
          <div className="hidden sm:block">
            {blogs?.map((blog) => (
              <BlogCard2 key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/4 sticky top-20">
          <ListSide />
        </div>
      </div>
      <div className="block sm:hidden max-w-xl mx-auto">
        <div className="mb-8">
          {blogs?.map((blog) => (
            <BlogCard1 key={blog.id} blog={blog} />
          ))}
        </div>
        <div>
          <ListSide />
        </div>
      </div>
    </>
  );
}

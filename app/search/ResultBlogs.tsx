import BlogCardForAll from "@/components/sections/BlogCardForAll";
import { BlogProps } from "@/types/types";
import React from "react";

export default function ResultBlogs({ blogs }: { blogs: BlogProps[] | undefined | null }) {
  return (
    <div>
      {blogs && blogs?.length > 0 ? (
        <div>
          <h2 className="mb-2 font-bold">Hasil dari Blog</h2>
          <div className="grid-all-list">
            {blogs?.map((blog) => (
              <BlogCardForAll key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { diffForHumans } from "@/lib/utils";
import { BlogProps } from "@/types/types";
import Link from "next/link";
import React from "react";

export default function BlogExcerpt({ blog }: { blog: BlogProps }) {
  return (
    <>
      <Link href={`/blog/category/${blog.BlogCategory.slug}`} className="link capitalize">
        {blog.BlogCategory.name}
      </Link>
      <span>•</span>
      <span>{diffForHumans(blog.createdAt)}</span>
    </>
  );
}

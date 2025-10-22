import React from "react";
import BlogExcerpt from "./BlogExcerpt";
import Image from "next/image";
import Link from "next/link";
import { BlogProps } from "@/types/types";
import { smartTrim } from "@/lib/utils";

export default function BlogCardForAll({ blog }: { blog: BlogProps | null | undefined }) {
  if (!blog) return null;

  return (
    <div key={blog.id} className="mb-4 rounded overflow-hidden flex flex-col">
      <Link href={`/blog/detail/${blog.slug}`} className="w-full h-36 block mb-2">
        <Image
          src={blog.imageUrl || "/logo-warungota.png"}
          alt={blog.title}
          width={500}
          height={500}
          className="w-full h-full object-cover object-center bg-gray-100"
        />
      </Link>
      <div className="w-full space-y-1 mb-0.5">
        <Link href={`/blog/detail/${blog.slug}`} className="hover:underline block">
          <h3 className="first-letter:capitalize">{smartTrim(blog.title, 40)}</h3>
        </Link>
        <BlogExcerpt blog={blog} />
      </div>
    </div>
  );
}

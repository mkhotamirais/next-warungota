import { diffForHumans, smartTrim } from "@/lib/utils";
import { BlogProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BlogExcerpt from "./BlogExcerpt";

export default function BlogCard2({ blog }: { blog: BlogProps }) {
  return (
    <div className="flex mb-4 gap-4">
      <Link href={`/blog/detail/${blog.slug}`} className="w-1/3 block h-52">
        <Image
          src={blog?.imageUrl || "/logo-warungota.png"}
          alt={blog.title}
          width={500}
          height={500}
          className="w-full h-full rounded-l object-cover object-center bg-gray-100"
        />
      </Link>
      <div className="w-2/3 h-52 flex flex-col space-y-2">
        <Link href={`/blog/detail/${blog.slug}`} className="hover:underline">
          <h3 className="h3">{smartTrim(blog.title, 64)}</h3>
        </Link>
        <div className="flex gap-2 text-sm text-gray-600">
          <BlogExcerpt blog={blog} />
        </div>
        <div className="tiptap" dangerouslySetInnerHTML={{ __html: smartTrim(blog.content, 160) }}></div>
        <p className="mt-auto">
          <span className="text-sm text-gray-500">{diffForHumans(blog.createdAt)}</span>
        </p>
      </div>
    </div>
  );
}

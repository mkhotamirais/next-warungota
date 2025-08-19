import { diffForHumans, smartTrim } from "@/lib/utils";
import { BlogProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogCard2({ blog }: { blog: BlogProps }) {
  return (
    <div className="flex mb-4 gap-4">
      <Link href={`/blog/${blog.slug}`} className="w-1/3 block h-48">
        <Image
          src={blog?.imageUrl || "/logo-warungota.png"}
          alt={blog.title}
          width={500}
          height={500}
          className="w-full h-full rounded-l object-cover object-center bg-gray-100"
        />
      </Link>
      <div className="w-2/3 h-48 flex flex-col space-y-2">
        <Link href={`/blog/${blog.slug}`} className="hover:underline">
          <h3 className="h3">{smartTrim(blog.title, 56)}</h3>
        </Link>
        <div className="tiptap" dangerouslySetInnerHTML={{ __html: smartTrim(blog.content, 210) }}></div>
        <div className="flex gap-2">
          <span>{blog.BlogCategory.name}</span>
          <span>•</span>
          <span>{blog.User.name}</span>
        </div>
        <p className="mt-auto">
          <span className="text-sm text-gray-500">{diffForHumans(blog.createdAt)}</span>
        </p>
      </div>
    </div>
  );
}

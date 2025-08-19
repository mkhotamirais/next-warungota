import { diffForHumans, smartTrim } from "@/lib/utils";
import { BlogProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogCard1({ blog, content = true }: { blog: BlogProps; content?: boolean }) {
  return (
    <div className="mb-6">
      <Link href={`/blog/${blog.slug}`}>
        <Image
          src={blog?.imageUrl || "/logo-warungota.png"}
          alt={blog.title}
          width={500}
          height={500}
          className="w-full h-56 rounded-t object-cover object-center bg-gray-100"
          priority
        />
      </Link>
      <div className={`${content ? "min-h-48" : "min-h-auto"} mt-3 flex flex-col space-y-2`}>
        <Link href={`/blog/${blog.slug}`} className="hover:underline">
          <h3 className="h3 mb-1">{smartTrim(blog.title, 56)}</h3>
        </Link>
        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
          <Link href="" className="link">
            {blog.BlogCategory.name}
          </Link>
          <span>•</span>
          <span>{diffForHumans(blog.createdAt)}</span>
        </div>
        {content ? (
          <div className="tiptap" dangerouslySetInnerHTML={{ __html: smartTrim(blog.content, 210) }}></div>
        ) : null}
      </div>
    </div>
  );
}

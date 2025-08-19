import { diffForHumans, smartTrim } from "@/lib/utils";
import { BlogProps } from "@/types/types";
import Image from "next/image";
import React from "react";

export default function BlogCard2({ blog }: { blog: BlogProps }) {
  return (
    <div key={blog.id} className="flex mb-4 gap-4">
      <Image
        src={blog?.imageUrl || "/logo-warungota.png"}
        alt={blog.title}
        width={500}
        height={500}
        className="w-1/3 h-48 rounded-l object-cover object-center bg-gray-100"
      />
      <div className="w-2/3 h-48 flex flex-col space-y-2">
        <h3 className="h3">{smartTrim(blog.title, 56)}</h3>
        <p className="text-sm leading-relaxed first-letter:capitalize text-gray-600">{smartTrim(blog.content, 210)}</p>
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

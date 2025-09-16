import { getBlogCategories } from "@/actions/blog";
import Link from "next/link";
import React from "react";

export default async function AsideBlogCategory() {
  const blogCategories = await getBlogCategories();
  return (
    <div>
      <h2 className="h2 mb-3">Blog Category</h2>
      <ul>
        <li className="list-inside list-disc py-1">
          <Link href="/blog" className="text-gray-500 hover:underline first-letter:uppercase">
            All Blogs
          </Link>
        </li>
        {blogCategories.map((category) => (
          <li key={category.id} className="list-inside list-disc py-1">
            <Link
              href={`/blog/category/${category.slug}`}
              className="text-gray-500 hover:underline first-letter:uppercase"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

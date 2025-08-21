import { getBlogCategories } from "@/lib/data";
import Link from "next/link";
import React from "react";

export default async function ListSide() {
  const categories = await getBlogCategories();
  if (!categories?.length) return <div>No Blog Category</div>;
  return (
    <div>
      <h2 className="h2 mb-4">Blog Category</h2>
      <ul className="flex flex-col ml-2">
        {categories.map((category) => (
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

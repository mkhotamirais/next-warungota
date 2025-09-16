import { getProductCategories } from "@/actions/product";
import Link from "next/link";
import React from "react";

export default async function AsideProdutCategory() {
  const categories = await getProductCategories();

  return (
    <div>
      <h2 className="h2 mb-4">Product Category</h2>
      <ul className="flex flex-col ml-2">
        {categories.map((category) => (
          <li key={category.id} className="list-inside list-disc py-1">
            <Link
              href={`/product/category/${category.slug}`}
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

import { getProductCategories } from "@/actions/product";
import Link from "next/link";
import React from "react";

export default async function AsideProdutCategory({ categorySlug }: { categorySlug?: string }) {
  const categories = await getProductCategories();

  return (
    <div className="mb-4">
      <div className="inline-flex flex-wrap ml-2 gap-1 items-center leading-none">
        <span className="inline-block font-semibold">Category:</span>
        <Link href="/product" className="badge">
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/product/category/${category.slug}`}
            className={`badge ${categorySlug === category.slug ? "bg-gray-500" : ""}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

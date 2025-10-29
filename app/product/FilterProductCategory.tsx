"use client";

import useFilterProducts from "@/hooks/useFilterProducts";
import { ProductCategory } from "@prisma/client";
import React from "react";

export default function FilterProductCategory({ productCategories }: { productCategories: ProductCategory[] }) {
  const { category, setCategory } = useFilterProducts();

  const handleCategory = (slug: string) => {
    if (category === slug) {
      setCategory(null);
    } else {
      setCategory(slug);
    }
  };
  return (
    <div>
      <h4 className="text-lg mb-2 font-semibold">Kategori</h4>
      <div className="flex gap-1 flex-wrap">
        {productCategories?.map((c) => (
          <button
            type="button"
            key={c.slug}
            onClick={() => handleCategory(c.slug)}
            className={`${c.slug === category ? "bg-primary text-white" : ""} btn-filter`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

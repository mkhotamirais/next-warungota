import ProductCard from "@/components/sections/ProductCard";
import { ProductProps } from "@/types/types";
import React from "react";

export default function OtherProducts({ otherProducts }: { otherProducts: ProductProps[] }) {
  return (
    <div className="py-8">
      <h2 className="h2 mb-4">Other Products</h2>
      <div className="grid-all-list">
        {otherProducts.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

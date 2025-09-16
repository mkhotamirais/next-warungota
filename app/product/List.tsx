import ProductCard from "@/components/sections/ProductCard";
import { ProductProps } from "@/types/types";
import React from "react";

export default function List({ products }: { products: ProductProps[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {products.map((item, i) => (
        <ProductCard key={i} item={item} />
      ))}
    </div>
  );
}

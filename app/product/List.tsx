import ProductCard from "@/components/sections/ProductCard";
import { ProductProps } from "@/types/types";
import React from "react";

export default function List({ products }: { products: ProductProps[] }) {
  return (
    <div className="grid-all-list">
      {products.map((item, i) => (
        <ProductCard key={i} item={item} />
      ))}
    </div>
  );
}

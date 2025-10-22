import { ProductProps } from "@/types/types";
import React from "react";
import { content as c } from "@/lib/content";
import ProductCard from "./ProductCard";

const { title, description } = c.product;

export default function HomeProduct({ products }: { products: ProductProps[] | undefined | null }) {
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="h2 mb-2">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {products?.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

import ProductCard from "@/components/sections/ProductCard";
import { ProductProps } from "@/types/types";
import React from "react";

export default function ResultProducts({ products }: { products: ProductProps[] | null | undefined }) {
  return (
    <div>
      {products && products?.length > 0 && (
        <div>
          <h2 className="mb-2 font-bold">Hasil dari Produk</h2>
          <div className="grid-all-list">
            {products?.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

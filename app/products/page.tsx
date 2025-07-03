"use client";

import PendingPage from "@/components/PendingPage";
import { useFetchProducts } from "@/lib/hooks/useFetchProducts";
import { IProduct } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function Products() {
  const { products, pendingProducts } = useFetchProducts();

  let content;

  if (pendingProducts) {
    content = <PendingPage />;
  } else {
    if (!products || products.length === 0) {
      content = <p>No products found</p>;
    } else {
      content = (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 lg:gap-2">
          {products.map((product: IProduct) => (
            <div key={product.id} className="border">
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <Link href={`/products/show/${product.id}`}>Detail</Link>
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <section>
      <div className="container">
        <h1>Products</h1>
        {content}
      </div>
    </section>
  );
}

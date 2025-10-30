import { getProducts } from "@/actions/product";
import ProductCard from "@/components/sections/ProductCard";
import Pagination from "@/components/ui/Pagination";
import React from "react";

interface ProductListProps {
  page: number;
  limit: number;
  keyword: string;
  categorySlug?: string;
  sortPrice?: "asc" | "desc" | null;
  minPrice?: string;
  maxPrice?: string;
}

export default async function ProductList({
  page,
  limit,
  keyword,
  categorySlug,
  sortPrice,
  minPrice,
  maxPrice,
}: ProductListProps) {
  const min = Number(minPrice);
  const max = Number(maxPrice);
  const { products, totalPages, totalProductsCount } = await getProducts({
    page,
    limit,
    keyword,
    categorySlug,
    sortPrice,
    minPrice: min,
    maxPrice: max,
  });

  return (
    <>
      {products?.length ? (
        <>
          <div className="grid-all-list">
            {products.map((item, i) => (
              <ProductCard key={i} item={item} />
            ))}
          </div>
          {totalProductsCount > limit ? (
            <Pagination totalPages={totalPages} currentPage={page} path="/product/page" />
          ) : null}
        </>
      ) : (
        <h2 className="h2">No Products Found</h2>
      )}
    </>
  );
}

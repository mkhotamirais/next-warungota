import { getProductCategories, getProducts } from "@/actions/product";
import ProductCard from "@/components/sections/ProductCard";
import Pagination from "@/components/ui/Pagination";
import React from "react";
import FilterProducts from "./FilterProducts";

const limit = 30;

interface ProductListProps {
  page: number;
  keyword: string;
  categorySlug?: string;
  sortPrice?: "asc" | "desc" | null;
  minPrice: string;
  maxPrice: string;
}

export default async function ProductList({
  page,
  keyword,
  categorySlug,
  sortPrice,
  minPrice,
  maxPrice,
}: ProductListProps) {
  const { products, totalPages, totalProductsCount } = await getProducts({
    page,
    limit,
    keyword,
    categorySlug,
  });
  const productCategories = await getProductCategories();

  let appliedProducts = products;

  const productsWithMinPrice = products.map((product) => ({
    ...product,
    minPrice: product.ProductVariant.reduce((min, variant) => Math.min(min, variant.price), Infinity),
  }));

  if (sortPrice) {
    appliedProducts =
      sortPrice === "asc"
        ? productsWithMinPrice.sort((a, b) => a.minPrice - b.minPrice)
        : productsWithMinPrice.sort((a, b) => b.minPrice - a.minPrice);
  } else {
    appliedProducts = products;
  }

  if (minPrice && maxPrice) {
    appliedProducts = productsWithMinPrice.filter(
      (product) => product?.minPrice >= Number(minPrice) && product.minPrice <= Number(maxPrice)
    );
  }

  return (
    <>
      <section>
        <div className="container py-4 flex flex-col justify-center items-center">
          <h1 className="text-xl font-semibold mb-3 sr-only">Product ({totalProductsCount})</h1>
          <div>
            <FilterProducts totalProductsCount={totalProductsCount} productCategories={productCategories} />
          </div>
        </div>
      </section>

      <>
        {appliedProducts?.length ? (
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
    </>
  );
}

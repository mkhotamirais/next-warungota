import { getProducts } from "@/actions/product";
import ProductCard from "@/components/sections/ProductCard";
import Pagination from "@/components/ui/Pagination";
import React from "react";

const limit = 30;

interface ProductListProps {
  page: number;
  // keyword: string;
  // categorySlug?: string;
  // sortPrice?: "asc" | "desc" | null;
  // minPrice: string;
  // maxPrice: string;
}

export default async function ProductList({
  page,
  // keyword,
  // categorySlug,
  // sortPrice,
  // minPrice,
  // maxPrice,
}: ProductListProps) {
  const { products, totalPages, totalProductsCount } = await getProducts({
    page,
    limit,
    // keyword,
    // categorySlug,
  });

  // let appliedProducts = products;

  // const productsWithMinPrice = products.map((product) => ({
  //   ...product,
  //   minPrice: product.ProductVariant.reduce((min, variant) => Math.min(min, variant.price), Infinity),
  // }));

  // if (sortPrice) {
  //   appliedProducts =
  //     sortPrice === "asc"
  //       ? productsWithMinPrice.sort((a, b) => a.minPrice - b.minPrice)
  //       : productsWithMinPrice.sort((a, b) => b.minPrice - a.minPrice);
  // } else {
  //   appliedProducts = products;
  // }

  // if (minPrice && maxPrice) {
  //   appliedProducts = productsWithMinPrice.filter(
  //     (product) => product?.minPrice >= Number(minPrice) && product.minPrice <= Number(maxPrice)
  //   );
  // }

  return (
    <div>
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
    </div>
  );
}

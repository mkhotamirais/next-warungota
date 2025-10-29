import React, { Suspense } from "react";
import { getProductCategories, getProducts } from "@/actions/product";
import FilterProducts from "./FilterProducts";
import ProductList from "./ProductList";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";

export default async function Product({
  params,
  searchParams,
}: {
  params: Promise<{ page?: string }>;
  searchParams: Promise<{
    keyword?: string;
    // categorySlug?: string;
    // sortPrice?: "asc" | "desc";
    // minPrice?: string;
    // maxPrice?: string;
  }>;
}) {
  const page = Number((await params).page || 1);
  const keyword = (await searchParams).keyword || "";
  // const categorySlug = (await searchParams).categorySlug || "";
  // const sortPrice = (await searchParams).sortPrice || null;
  // const minPrice = (await searchParams).minPrice || "";
  // const maxPrice = (await searchParams).maxPrice || "";

  const { totalProductsCount } = await getProducts();
  const productCategories = await getProductCategories();

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
      <section className="py-12 bg-gray-200">
        <div className="container">
          {/* <Suspense fallback={<FallbackSearchProducts />} key={`${keyword}-${categorySlug}`}> */}
          <Suspense fallback={<FallbackSearchProducts />} key={keyword}>
            <ProductList
              page={page}
              keyword={keyword}
              // categorySlug={categorySlug}
              // sortPrice={sortPrice}
              // minPrice={minPrice}
              // maxPrice={maxPrice}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}

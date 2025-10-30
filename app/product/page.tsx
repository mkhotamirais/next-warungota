import React, { Suspense } from "react";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";
import { getAllProductsName, getProductCategories } from "@/actions/product";
import FilterProducts from "./FilterProducts";
import ProductList from "./ProductList";

const limit = 30;

export default async function Product({
  params,
  searchParams,
}: {
  params: Promise<{ page?: string }>;
  searchParams: Promise<{
    keyword?: string;
    categorySlug?: string;
    sortPrice?: "asc" | "desc" | null;
    minPrice?: string;
    maxPrice?: string;
    prekeyword?: string;
  }>;
}) {
  const page = Number((await params).page || 1);
  const keyword = (await searchParams).keyword || "";
  const categorySlug = (await searchParams).categorySlug || "";
  const sortPrice = (await searchParams).sortPrice || null;
  const minPrice = (await searchParams).minPrice || "";
  const maxPrice = (await searchParams).maxPrice || "";

  const prekeyword = (await searchParams).prekeyword || "";

  const productCategories = await getProductCategories();
  const productNames = await getAllProductsName(prekeyword);

  return (
    <>
      <section className="py-4">
        <div className="container">
          <div className="py-4 flex flex-col justify-center items-center bg-white">
            <h1 className="text-xl font-semibold mb-3 sr-only">Product </h1>
            <FilterProducts productCategories={productCategories} productNames={productNames} />
          </div>
        </div>
      </section>
      <section className="py-10 bg-gray-200">
        <div className="container">
          <Suspense
            fallback={<FallbackSearchProducts />}
            key={`${keyword}-${categorySlug}-${sortPrice}-${minPrice}-${maxPrice}`}
          >
            <ProductList
              page={page}
              limit={limit}
              keyword={keyword}
              categorySlug={categorySlug}
              sortPrice={sortPrice}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}

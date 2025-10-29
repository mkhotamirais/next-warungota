import React, { Suspense } from "react";
import { getProductCategories, getProducts } from "@/actions/product";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";
import FilterProducts from "../../FilterProducts";
import ProductList from "../../ProductList";

const limit = 30;

export const generateMetadata = async ({ params }: { params: Promise<{ page: string }> }) => {
  const page = Number((await params).page);
  return { title: `Product Page ${page}` };
};

export const generateStaticParams = async () => {
  const { totalPages } = await getProducts({ limit });
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
};

export default async function ProductPaginate({
  params,
  searchParams,
}: {
  params: Promise<{ page?: string }>;
  searchParams: Promise<{
    keyword?: string;
    categorySlug?: string;
    sortPrice?: "asc" | "desc";
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const page = Number((await params).page || 1);
  const keyword = (await searchParams).keyword || "";
  const categorySlug = (await searchParams).categorySlug || "";
  const sortPrice = (await searchParams).sortPrice || null;
  const minPrice = (await searchParams).minPrice || "";
  const maxPrice = (await searchParams).maxPrice || "";

  const productCategories = await getProductCategories();

  return (
    <>
      <section className="py-4">
        <div className="container">
          <div className="py-4 flex flex-col justify-center items-center bg-white">
            <h1 className="text-xl font-semibold mb-3 sr-only">Product </h1>
            <FilterProducts productCategories={productCategories} />
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-200">
        <div className="container">
          <Suspense fallback={<FallbackSearchProducts />} key={`${keyword}-${categorySlug}`}>
            <ProductList
              page={page}
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

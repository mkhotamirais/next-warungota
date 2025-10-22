import { searchAll } from "@/actions/search-all";
import React, { Suspense } from "react";
import ResultProducts from "./ResultProducts";
import FallbackSearch from "./FallbackSearch";
import ResultBlogs from "./ResultBlogs";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ keyword: string }> }) {
  const keyword = (await searchParams).keyword;

  const results = await searchAll(keyword);
  const products = results?.products;
  const blogs = results?.blogs;

  return (
    <section className="py-8">
      <div className="container space-y-3">
        <h1 className="text-xl">
          Hasil Pencarian <b>`{keyword}`</b>
        </h1>
        <div className="space-y-3">
          {products?.length === 0 && blogs?.length === 0 ? (
            <p>Tidak ada hasil pencarian</p>
          ) : (
            <div className="space-y-3">
              <Suspense fallback={<FallbackSearch />}>
                <ResultProducts products={products} />
              </Suspense>
              <Suspense fallback={<FallbackSearch />}>
                <ResultBlogs blogs={blogs} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

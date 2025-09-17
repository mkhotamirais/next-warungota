import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import { content as c } from "@/lib/content";
import Load from "@/components/fallbacks/Load";
import List from "./List";
import { getProducts } from "@/actions/product";
import AsideProdutCategory from "@/components/sections/AsideProdutCategory";
// import Pagination from "@/components/ui/Pagination";

const { title, description } = c.product;

export default async function Product({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Number((await searchParams).page || 1);

  const { products } = await getProducts({ page, limit: 2 });

  return (
    <>
      <Hero title={title} description={description} />
      <section className="py-12">
        <div className="container">
          {products?.length ? (
            <>
              <Suspense fallback={<Load />}>
                <List products={products} />
              </Suspense>
              {/* <Pagination totalPages={totalPages} /> */}
            </>
          ) : (
            <h2 className="h2">No Products Found</h2>
          )}
          <div className="mt-8">
            <AsideProdutCategory />
          </div>
        </div>
      </section>
    </>
  );
}

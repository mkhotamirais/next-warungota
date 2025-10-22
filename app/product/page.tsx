import Hero from "@/components/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";
import List from "./List";
import { getProducts } from "@/actions/product";
import AsideProdutCategory from "@/components/sections/AsideProdutCategory";
import Pagination from "@/components/ui/Pagination";

const { title, description } = c.product;
const limit = 12;

export default async function Product({ params }: { params: Promise<{ page?: string }> }) {
  const page = Number((await params).page || 1);

  const { products, totalPages, totalProductsCount } = await getProducts({ page, limit });

  return (
    <>
      <Hero title={title} description={description} />
      <section className="py-12">
        <div className="container">
          <AsideProdutCategory />

          {products?.length ? (
            <>
              <List products={products} />
              {totalProductsCount > limit ? (
                <Pagination totalPages={totalPages} currentPage={page} path="/product/page" />
              ) : null}
            </>
          ) : (
            <h2 className="h2">No Products Found</h2>
          )}
        </div>
      </section>
    </>
  );
}

import Hero from "@/components/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";
import { getProducts } from "@/actions/product";
import AsideProdutCategory from "@/components/sections/AsideProdutCategory";
import Pagination from "@/components/ui/Pagination";
import List from "../../List";

const { description } = c.product;
const limit = 8;

export const generateMetadata = async ({ params }: { params: Promise<{ page: string }> }) => {
  const page = Number((await params).page);
  return { title: `Product Page ${page}` };
};

export const generateStaticParams = async () => {
  const { totalPages } = await getProducts({ limit });
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
};

export default async function ProductPaginate({ params }: { params: Promise<{ page?: string }> }) {
  const page = Number((await params).page || 1);
  const { products, totalPages, totalProductsCount } = await getProducts({ page, limit });

  return (
    <>
      <Hero title={`Product Page ${page}`} description={description} />
      <section className="py-12">
        <div className="container">
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
          <div className="mt-8">
            <AsideProdutCategory />
          </div>
        </div>
      </section>
    </>
  );
}

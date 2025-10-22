import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import { getProductCategoryBySlug, getProducts } from "@/actions/product";
import Load from "@/components/fallbacks/Load";
import Pagination from "@/components/ui/Pagination";
import AsideProdutCategory from "@/components/sections/AsideProdutCategory";
import List from "@/app/product/List";

const limit = 12;

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const category = await getProductCategoryBySlug(slug);
  return { title: category?.name };
};

export const generateStaticParams = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const categorySlug = (await params).slug;
  const { totalPages } = await getProducts({ limit, categorySlug });
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
};

export default async function ProductCategoryPaginate({ params }: { params: Promise<{ slug: string; page: string }> }) {
  const categorySlug = (await params).slug;
  const page = Number((await params).page || 1);
  const categoryName = categorySlug.replace(/-/g, " ");

  const { products, totalPages } = await getProducts({ page, limit, categorySlug });

  return (
    <>
      <Hero title={`Product - ${categoryName}`} />
      <section className="py-12">
        <div className="container">
          <AsideProdutCategory categorySlug={categorySlug} />

          {products?.length ? (
            <>
              <Suspense fallback={<Load />}>
                <List products={products} />
              </Suspense>
              <Pagination totalPages={totalPages} currentPage={page} path={`/product/category/${categorySlug}`} />
            </>
          ) : (
            <h2 className="h2">No Products Found</h2>
          )}
        </div>
      </section>
    </>
  );
}

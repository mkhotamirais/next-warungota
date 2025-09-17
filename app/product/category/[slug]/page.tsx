import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import List from "../../List";
import { getProductCategoryBySlug, getProducts } from "@/actions/product";
import Load from "@/components/fallbacks/Load";
import Pagination from "@/components/ui/Pagination";
import AsideProdutCategory from "@/components/sections/AsideProdutCategory";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const category = await getProductCategoryBySlug(slug);
  return { title: category?.name };
};

export default async function ProductCategory({ params }: { params: Promise<{ slug: string }> }) {
  const categorySlug = (await params).slug;
  const categoryName = categorySlug.replace(/-/g, " ");

  const { products, totalPages } = await getProducts({ categorySlug });

  return (
    <>
      <Hero title={`Product - ${categoryName}`} />
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

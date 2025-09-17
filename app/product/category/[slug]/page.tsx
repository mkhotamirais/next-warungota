import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import List from "../../List";
import { getProductCategories, getProductCategoryBySlug, getProducts } from "@/actions/product";
import Load from "@/components/fallbacks/Load";
import Pagination from "@/components/ui/Pagination";
import AsideProdutCategory from "@/components/sections/AsideProdutCategory";

const limit = 1;

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const category = await getProductCategoryBySlug(slug);
  return { title: category?.name };
};

export const generateStaticParams = async () => {
  const categories = await getProductCategories();
  return categories.map((category) => ({ slug: category.slug }));
};

export default async function ProductCategory({ params }: { params: Promise<{ slug: string }> }) {
  const categorySlug = (await params).slug;
  const categoryName = categorySlug.replace(/-/g, " ");

  const { products, totalPages } = await getProducts({ limit, categorySlug });

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
              <Pagination totalPages={totalPages} currentPage={1} path={`/product/category/${categorySlug}`} />
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

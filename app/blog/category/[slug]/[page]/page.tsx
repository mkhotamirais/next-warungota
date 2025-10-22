import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import { getBlogCategoryBySlug, getBlogs } from "@/actions/blog";
import Load from "@/components/fallbacks/Load";
import Pagination from "@/components/ui/Pagination";
import AsideBlogCategory from "@/components/sections/AsideBlogCategory";
import List from "@/app/blog/List";

const limit = 12;

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const category = await getBlogCategoryBySlug(slug);
  return { title: category?.name };
};

export const generateStaticParams = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const categorySlug = (await params).slug;
  const { totalPages } = await getBlogs({ limit, categorySlug });
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
};

export default async function BlogCategory({ params }: { params: Promise<{ slug: string; page: string }> }) {
  const categorySlug = (await params).slug;
  const page = Number((await params).page || 1);
  const categoryName = categorySlug.replace(/-/g, " ");

  const { blogs, totalPages } = await getBlogs({ page, limit, categorySlug });

  return (
    <>
      <Hero title={`Blog - ${categoryName}`} />
      <section className="py-12">
        <div className="container">
          <AsideBlogCategory categorySlug={categorySlug} />

          <div className="">
            {blogs?.length ? (
              <>
                <Suspense fallback={<Load />}>
                  <List blogs={blogs} />
                  <Pagination totalPages={totalPages} currentPage={1} path={`/blog/category/${categorySlug}`} />
                </Suspense>
              </>
            ) : (
              <h2 className="h2">No Blog Found</h2>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import { getBlogCategories, getBlogCategoryBySlug, getBlogs } from "@/actions/blog";
import Load from "@/components/fallbacks/Load";
import Pagination from "@/components/ui/Pagination";
import AsideBlogCategory from "@/components/sections/AsideBlogCategory";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const category = await getBlogCategoryBySlug(slug);
  return { title: category?.name };
};

export const generateStaticParams = async () => {
  const categories = await getBlogCategories();
  return categories.map((category) => ({ slug: category.slug }));
};

export default async function BlogCategory({ params }: { params: Promise<{ slug: string }> }) {
  const categorySlug = (await params).slug;
  const categoryName = categorySlug.replace(/-/g, " ");

  const { blogs, totalPages } = await getBlogs({ categorySlug });

  return (
    <>
      <Hero title={`Blog - ${categoryName}`} />
      <section className="py-12">
        <div className="container flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4">
            {blogs?.length ? (
              <>
                <Suspense fallback={<Load />}>{/* <BlogList blogs={blogs} /> */}</Suspense>
                <Pagination totalPages={totalPages} />
              </>
            ) : (
              <h2 className="h2">No Blog Found</h2>
            )}
          </div>
          <div className="w-full md:w-1/4">
            <AsideBlogCategory />
          </div>
        </div>
      </section>
    </>
  );
}

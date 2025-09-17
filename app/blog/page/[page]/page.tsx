import Hero from "@/components/sections/Hero";
import React from "react";
import { getBlogs } from "@/actions/blog";
import { content as c } from "@/lib/content";
import Pagination from "@/components/ui/Pagination";
import AsideBlogCategory from "@/components/sections/AsideBlogCategory";
import List from "../../List";

const { description } = c.blog;
const limit = 2;

export const generateMetadata = async ({ params }: { params: Promise<{ page: string }> }) => {
  const page = Number((await params).page);
  return { title: `Blog Page ${page}` };
};

export const generateStaticParams = async () => {
  const { totalPages } = await getBlogs({ limit });
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
};

export default async function BlogPaginate({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  const { blogs, totalPages } = await getBlogs({ page, limit });

  return (
    <>
      <Hero title={`Blog Page ${page}`} description={description} />
      <section className="py-12">
        <div className="container flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4">
            {blogs?.length ? (
              <>
                <List blogs={blogs} />
                <Pagination totalPages={totalPages} currentPage={page} path="/blog/page" />
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

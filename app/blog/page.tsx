import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import { content as c } from "@/lib/content";
import { getBlogs } from "@/actions/blog";
import Load from "@/components/fallbacks/Load";
import Pagination from "@/components/ui/Pagination";
import AsideBlogCategory from "@/components/sections/AsideBlogCategory";
import List from "./List";

const { title, description } = c.blog;

const LIMIT = 3;

export async function generateStaticParams() {
  const { totalBlogsCount } = await getBlogs({ limit: 1 });
  const totalPages = Math.ceil(totalBlogsCount / LIMIT);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return [{ page: "1" }, ...pages];
}

export default async function Blog({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Number((await searchParams).page || 1);

  const { blogs, totalPages } = await getBlogs({ page, limit: LIMIT });

  return (
    <>
      <Hero title={title} description={description} />
      <section className="py-12">
        <div className="container flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4">
            {blogs?.length ? (
              <>
                <Suspense fallback={<Load />}>
                  <List blogs={blogs} />
                </Suspense>
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

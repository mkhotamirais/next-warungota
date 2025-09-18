import Hero from "@/components/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";
import { getBlogs } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";
import AsideBlogCategory from "@/components/sections/AsideBlogCategory";
import List from "./List";

const { title, description } = c.blog;
const limit = 8;

export default async function Blog() {
  const { blogs, totalPages, totalBlogsCount } = await getBlogs({ page: 1, limit });

  return (
    <>
      <Hero title={title} description={description} />
      <section className="py-12">
        <div className="container flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4">
            {blogs?.length ? (
              <>
                <List blogs={blogs} />
                {totalBlogsCount > limit ? (
                  <Pagination totalPages={totalPages} currentPage={1} path="/blog/page" />
                ) : null}
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

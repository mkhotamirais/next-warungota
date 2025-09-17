import Hero from "@/components/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";
import { getBlogs } from "@/actions/blog";
// import Load from "@/components/fallbacks/Load";
// import Pagination from "@/components/ui/Pagination";
import AsideBlogCategory from "@/components/sections/AsideBlogCategory";
import List from "./List";

const { title, description } = c.blog;

export default async function Blog() {
  // const page = Number((await searchParams).page || 1);

  const { blogs } = await getBlogs({ page: 1, limit: 3 });

  return (
    <>
      <Hero title={title} description={description} />
      <section className="py-12">
        <div className="container flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4">
            {blogs?.length ? (
              <>
                <List blogs={blogs} />
                {/* <Pagination totalPages={totalPages} /> */}
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

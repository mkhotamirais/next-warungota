import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import { content as c } from "@/lib/content";
import { getBlogs } from "@/lib/data";
import List from "./List";
import Load from "@/components/fallbacks/Load";

const { title, description } = c.blog;

export default async function Blog() {
  const blogs = await getBlogs();
  return (
    <>
      <Hero title={title} description={description} />
      <section className="py-12">
        <div className="container">
          <Suspense fallback={<Load />}>
            <List blogs={blogs} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

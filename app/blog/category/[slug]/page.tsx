import Hero from "@/components/sections/Hero";
import { getBlogs } from "@/lib/data";
import React from "react";
import List from "../../List";

export default async function BlogCategory({ params }: { params: Promise<{ slug: string }> }) {
  const categorySlug = (await params).slug;
  const categoryName = categorySlug.replace(/-/g, " ");

  const blogs = await getBlogs(undefined, undefined, categorySlug);

  return (
    <>
      <Hero title={`Blog - ${categoryName}`} />
      <section className="py-12">
        <div className="container">
          <List blogs={blogs} />
        </div>
      </section>
    </>
  );
}

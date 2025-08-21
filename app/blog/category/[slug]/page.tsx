import Hero from "@/components/sections/Hero";
import { getBlogCategories, getBlogCategoryBySlug, getBlogs } from "@/lib/data";
import React from "react";
import List from "../../List";

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

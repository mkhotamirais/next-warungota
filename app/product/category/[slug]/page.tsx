import Hero from "@/components/sections/Hero";
import React from "react";
import List from "../../List";
import { getProducts } from "@/actions/product";

export default async function ProductCategory({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const categoryName = slug.replace(/-/g, " ");
  const products = await getProducts({ categorySlug: slug });

  return (
    <>
      <Hero title={`Product - ${categoryName}`} />
      <section className="py-12">
        <div className="container">
          <List products={products} />
        </div>
      </section>
    </>
  );
}

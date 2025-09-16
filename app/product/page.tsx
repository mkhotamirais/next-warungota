import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import { content as c } from "@/lib/content";
import Load from "@/components/fallbacks/Load";
import List from "./List";
import { getProducts } from "@/actions/product";
import AsideProdutCategory from "@/components/sections/AsideProdutCategory";

const { title, description } = c.product;

export default async function Product() {
  const products = await getProducts();

  return (
    <>
      <Hero title={title} description={description} />
      <section className="py-12">
        <div className="container">
          <Suspense fallback={<Load />}>
            <List products={products} />
          </Suspense>
          <div className="mt-8">
            <AsideProdutCategory />
          </div>
        </div>
      </section>
    </>
  );
}

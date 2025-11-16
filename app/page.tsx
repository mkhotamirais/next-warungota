import { getBlogs } from "@/actions/blog";
import { getProducts } from "@/actions/product";
import HomeBlog from "@/components/sections/HomeBlog";
// import HomeHero from "@/components/sections/HomeHero";
import HomeProduct from "@/components/sections/HomeProduct";
import React from "react";

export default async function Home() {
  const { products } = await getProducts({ limit: 12 });
  const { blogs } = await getBlogs({ limit: 12 });

  return (
    <>
      {/* <HomeHero /> */}
      <h1 className="sr-only">WarungOta: Belanja dan Fotokopi dalam Satu Tempat</h1>
      <HomeProduct products={products} />
      <HomeBlog blogs={blogs} />
    </>
  );
}

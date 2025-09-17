// import Load from "@/components/fallbacks/Load";
// import HomeBlog from "@/components/sections/HomeBlog";
import HomeHero from "@/components/sections/HomeHero";
// import HomeProduct from "@/components/sections/HomeProduct";
import React from "react";

export default async function Home() {
  // const [products, blogs] = await Promise.all([getProducts(4), getBlogs(3)]);
  // const products = await getProducts(4);

  // if (!products?.length) return null;

  return (
    <>
      <HomeHero />
      {/* <Suspense fallback={<Load />}>
        <HomeProduct products={products} />
      </Suspense> */}
      {/* <Suspense fallback={<Load />}>
        <HomeBlog blogs={blogs} />
      </Suspense> */}
    </>
  );
}

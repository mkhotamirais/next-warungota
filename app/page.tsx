import HomeBlog from "@/components/sections/HomeBlog";
import HomeHero from "@/components/sections/HomeHero";
import { getBlogs } from "@/lib/data";
import React, { Suspense } from "react";

export default async function Home() {
  const blogs = await getBlogs(4);

  return (
    <>
      <HomeHero />
      <Suspense fallback={<div>Loading...</div>}>
        <HomeBlog blogs={blogs} />
      </Suspense>
    </>
  );
}

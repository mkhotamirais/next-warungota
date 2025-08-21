import Load from "@/components/fallbacks/Load";
import HomeBlog from "@/components/sections/HomeBlog";
import HomeHero from "@/components/sections/HomeHero";
import { getBlogs } from "@/lib/data";
import React, { Suspense } from "react";

export default async function Home() {
  const blogs = await getBlogs(3);

  return (
    <>
      <HomeHero />
      <Suspense fallback={<Load />}>
        <HomeBlog blogs={blogs} />
      </Suspense>
    </>
  );
}

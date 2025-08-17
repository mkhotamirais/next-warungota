import Hero from "@/components/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";
// import { auth } from "@/auth";

const { title, description } = c.home.hero;

export default async function Home() {
  // const session = await auth();
  return (
    <>
      <Hero title={title} description={description} />
      {/* <div></div> */}
    </>
  );
}

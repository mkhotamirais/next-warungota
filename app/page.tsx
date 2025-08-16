import Hero from "@/components/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";

const { title, description } = c.home.hero;

export default function Home() {
  return (
    <>
      <Hero title={title} description={description} />
    </>
  );
}

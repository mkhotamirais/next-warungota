import Hero from "@/components/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";

const { title, description } = c.blog;

export default function Blog() {
  return (
    <>
      <Hero title={title} description={description} />
    </>
  );
}

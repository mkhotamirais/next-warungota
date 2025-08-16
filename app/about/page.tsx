import Hero from "@/componnts/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";

const { title, description } = c.about;

export default function About() {
  return (
    <>
      <Hero title={title} description={description} />
    </>
  );
}

import Hero from "@/components/sections/Hero";
import React from "react";
import { content as c } from "@/lib/content";

const { title, description } = c.contact;

export default function Contact() {
  return (
    <>
      <Hero title={title} description={description} />
    </>
  );
}

import React from "react";
import BasePage from "./BasePage";
import { limits as l } from "@/lib/constants";

export default async function DummyjsonPage() {
  const data = await fetch(`https://dummyjson.com/posts?limit=${l.product}`).then((res) => res.json());
  const posts = data.posts;
  const totalPages = Math.ceil(data.total / l.product);
  return <BasePage data={posts} page={1} totalPages={totalPages} />;
}

import React from "react";
import BasePage from "./BasePage";
import { limit } from "@/lib/constants";

export default async function DummyjsonPage() {
  const data = await fetch(`https://dummyjson.com/posts?limit=${limit}`).then((res) => res.json());
  const posts = data.posts;
  const totalPages = Math.ceil(data.total / limit);
  return <BasePage data={posts} page={1} totalPages={totalPages} />;
}

import React from "react";
import BasePage from "../../BasePage";
import { limit } from "@/lib/constants";

export default async function DummyjsonPaginate({ params }: { params: Promise<{ page?: string }> }) {
  const page = Number((await params).page);
  const skip = page === 1 ? 0 : (page - 1) * limit;
  const data = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`).then((res) => res.json());
  const posts = data.posts;
  const totalPages = Math.ceil(data.total / limit);

  return <BasePage data={posts} page={page} totalPages={totalPages} />;
}

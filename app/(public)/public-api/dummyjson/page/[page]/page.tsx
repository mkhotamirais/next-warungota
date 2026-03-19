import React from "react";
import BasePage from "../../BasePage";
import { limits as l } from "@/lib/constants";

export const generateStaticParams = async () => {
  const data = await fetch(`https://dummyjson.com/posts?limit=${l.product}`).then((res) => res.json());
  const total = data.total;
  const totalPages = Math.ceil(total / l.product);
  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
};

export default async function DummyjsonPaginate({ params }: { params: Promise<{ page?: string }> }) {
  const page = Number((await params).page);
  const skip = page === 1 ? 0 : (page - 1) * l.product;
  const data = await fetch(`https://dummyjson.com/posts?limit=${l.product}&skip=${skip}`).then((res) => res.json());
  const posts = data.posts;
  const totalPages = Math.ceil(data.total / l.product);

  return <BasePage data={posts} page={page} totalPages={totalPages} />;
}

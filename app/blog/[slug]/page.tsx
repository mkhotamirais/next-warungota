import { getBlogBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import React from "react";

export default async function BlogSlug({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const blog = await getBlogBySlug(slug);

  if (!blog) return notFound();

  return (
    <div>
      BlogSlug {slug}
      <div>{blog.title}</div>
    </div>
  );
}

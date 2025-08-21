import BlogExcerpt from "@/components/sections/BlogExcerpt";
import { getBlogBySlug, getBlogs } from "@/lib/data";
import { diffForHumans, smartTrim } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function BlogSlug({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const [blog, latestBlogs] = await Promise.all([getBlogBySlug(slug), getBlogs(8, slug)]);

  if (!blog || !latestBlogs?.length) return notFound();

  return (
    <section className="py-8">
      <div className="container flex flex-col lg:flex-row items-start gap-8">
        <div className="w-full lg:w-2/3">
          <h1 className="h1 mb-4 text-center">{blog.title}</h1>
          <div className="mb-8 text-center flex gap-2 justify-center text-gray-500">
            <BlogExcerpt blog={blog} />
          </div>
          <Image
            src={blog.imageUrl || "/logo-warungota.png"}
            alt={blog.title}
            width={800}
            height={800}
            className="mb-6 w-full h-64 sm:h-80 lg:h-100 object-cover object-center"
          />
          <div className="tiptap" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </div>
        <div className="w-full lg:w-1/3 sticky top-20">
          <h2 className="h2 mb-6">Latest Blogs</h2>
          {latestBlogs?.map((blog) => (
            <div key={blog.id} className="mb-4">
              <Link href={`/blog/detail/${blog.slug}`} className="group flex gap-2 h-20">
                <Image
                  src={blog.imageUrl || "/logo-warungota.png"}
                  alt={blog.title}
                  width={50}
                  height={50}
                  className="w-1/3 sm:w-1/5 lg:w-1/3 h-full rounded object-cover object-center"
                />
                <div className="w-2/3 sm:w-4/5 lg:w-2/3 h-full flex flex-col">
                  <h3 className="group-hover:underline font-semibold first-letter:uppercase">
                    {smartTrim(blog.title, 42)}
                  </h3>
                  <div className="text-sm text-gray-500 mt-auto">{diffForHumans(blog.createdAt)}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

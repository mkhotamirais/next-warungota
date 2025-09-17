export const revalidate = 60;

import { content as c } from "@/lib/content";
import { BlogProps } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import BlogExcerpt from "./BlogExcerpt";

const { title, description } = c.blog;

export default async function HomeBlog({ blogs }: { blogs: BlogProps[] | undefined | null }) {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="h2 mb-2">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="grid sm:grid-cols-4 gap-2 lg:gap-8">
          {blogs?.map((blog) => (
            <div key={blog.id} className="mb-6 rounded overflow-hidden flex flex-col gap-4">
              <Link href={`/blog/detail/${blog.slug}`} className="w-full h-64 block">
                <Image
                  src={blog?.imageUrl || "/logo-warungota.png"}
                  alt={blog.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover object-center bg-gray-100"
                />
              </Link>
              <div className="w-full space-y-3">
                <Link href={`/blog/detail/${blog.slug}`} className="hover:underline block">
                  <h3 className="h3">{blog.title}</h3>
                </Link>
                <BlogExcerpt blog={blog} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

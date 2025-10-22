export const revalidate = 60;

import { content as c } from "@/lib/content";
import { BlogProps } from "@/types/types";
import Link from "next/link";
import Button from "../ui/Button";
import BlogCardForAll from "./BlogCardForAll";

const { title, description } = c.blog;

export default async function HomeBlog({ blogs }: { blogs: BlogProps[] | undefined | null }) {
  return (
    <section className="py-10 bg-gray-100">
      <div className="container">
        <div className="mb-4 text-center">
          <h2 className="h2 mb-2">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="grid-all-list">
          {blogs?.map((blog) => (
            <BlogCardForAll blog={blog} key={blog.id} />
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button as={Link} href="/blog" className="py-3 px-">
            Semua Blog
          </Button>
        </div>
      </div>
    </section>
  );
}

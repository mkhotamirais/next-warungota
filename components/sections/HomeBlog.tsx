export const revalidate = 60;

import { content as c } from "@/lib/content";
// import BlogCard1 from "@/components/BlogCard1";
import { BlogProps } from "@/types/types";
import BlogCard1 from "./BlogCard1";

const { title, description } = c.blog;

export default async function HomeBlog({ blogs }: { blogs: BlogProps[] | undefined | null }) {
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="h2 mb-2">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-2 lg:gap-8">
          {blogs?.map((blog) => (
            <BlogCard1 key={blog.id} blog={blog} content={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

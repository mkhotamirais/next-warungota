"use client";

import Image from "next/image";
import Delete from "./Delete";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import { BlogProps } from "@/types/types";
import { useGlobal } from "@/hooks/useGlobal";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useBlog } from "@/hooks/useBlog";
import BlogExcerpt from "@/components/sections/BlogExcerpt";
import { smartTrim } from "@/lib/utils";

export default function List({ blogs }: { blogs: BlogProps[] | undefined | null }) {
  const { setOpenLayer, openMoreBlogOption, setOpenMoreBlogOption } = useGlobal();
  const { successMsg, errorMsg } = useBlog();

  const openMoreOptions = (id: string) => {
    setOpenMoreBlogOption(id);
    setOpenLayer(true);
  };

  const closeMoreOptions = () => {
    setOpenMoreBlogOption(null);
    setOpenLayer(false);
  };

  if (!blogs?.length) return <h2 className="h2">No Blog Found</h2>;

  return (
    <div>
      <div className="my-1">
        {successMsg ? <Msg msg={successMsg} /> : null}
        {errorMsg ? <Msg msg={errorMsg} error /> : null}
      </div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="h2">Blog List</h2>
        <Button as={Link} href="/dashboard/blog/create-blog">
          Create Blog
        </Button>
      </div>
      <div>
        {blogs?.map((blog) => (
          <div key={blog.id} className="mb-2">
            <div className="flex justify-between items-center w-full border border-gray-300 bg-gray-100 rounded">
              <div className="flex gap-2 w-full p-1">
                <Link href={`/blog/detail/${blog.slug}`} className="">
                  <Image
                    src={blog?.imageUrl || "/logo-warungota.png"}
                    alt={blog.title}
                    width={50}
                    height={50}
                    className="size-14"
                  />
                </Link>
                <div className="flex flex-col gap-1">
                  <Link href={`/blog/detail/${blog.slug}`} className="hover:underline">
                    <h3 className="h3">{smartTrim(blog.title, 40)}</h3>
                  </Link>
                  <BlogExcerpt blog={blog} />
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => openMoreOptions(blog.id)}
                  type="button"
                  className="p-2 m-2 h-full hover:bg-gray-200 rounded"
                  aria-label="more"
                >
                  <HiDotsVertical />
                </button>
                <div
                  className={`${
                    openMoreBlogOption === blog.id ? "visible opacity-100" : "invisible opacity-0"
                  } absolute flex flex-col gap-1 top-full right-0 bg-white border border-gray-300 rounded p-2 z-50`}
                >
                  <Button as={Link} onClick={closeMoreOptions} href={`/dashboard/blog/edit-blog/${blog.slug}`}>
                    Edit
                  </Button>
                  <Delete blog={blog} closeMoreOptions={closeMoreOptions} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

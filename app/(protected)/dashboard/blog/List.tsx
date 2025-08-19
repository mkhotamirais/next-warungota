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
      <h2 className="h2 mb-4">Blog List</h2>
      <div>
        {blogs?.map((blog) => (
          <div key={blog.id} className="mb-2">
            <div className="flex justify-between items-center w-full border border-gray-300 bg-gray-100 rounded">
              <div className="flex gap-2 w-full p-1">
                <Image
                  src={blog?.imageUrl || "/logo-warungota.png"}
                  alt={blog.title}
                  width={50}
                  height={50}
                  className="size-14"
                />
                <div>
                  <h3 className="h3 mb-0.5">{blog.title}</h3>
                  <div className="flex text-sm gap-2">
                    <span>{blog.BlogCategory.name}</span>
                    <span>|</span>
                    <span>{blog.User.name}</span>
                  </div>
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

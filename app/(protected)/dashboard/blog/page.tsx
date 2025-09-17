import List from "./List";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
import { getBlogs } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";

const limit = 1;

export default async function AdminBlog() {
  // const session = await auth();
  // if (!session || !session.user) redirect("/profile");

  const { blogs, totalPages } = await getBlogs({ page: 1, limit });
  // if (session?.user?.role === "editor") {
  //   ({ blogs, totalPages } = await getBlogs({ userId: session.user.id }));
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <List blogs={blogs} />
      <Pagination totalPages={totalPages} currentPage={1} path="/dashboard/blog/page" />
    </Suspense>
  );
}

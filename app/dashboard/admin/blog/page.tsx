import List from "./List";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBlogs } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";
import Load from "@/components/fallbacks/Load";

const limit = 8;

export default async function AdminBlog() {
  const session = await auth();
  if (!session || !session.user) redirect("/");

  let { blogs, totalPages, totalBlogsCount } = await getBlogs({ page: 1, limit });
  if (session?.user?.role === "editor") {
    ({ blogs, totalPages, totalBlogsCount } = await getBlogs({ userId: session.user.id }));
  }

  return (
    <Suspense fallback={<Load />}>
      <List blogs={blogs} />
      {totalBlogsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={1} path="/dashboard/blog/page" />
      ) : null}
    </Suspense>
  );
}

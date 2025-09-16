import { Suspense } from "react";
import List from "./List";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Load from "@/components/fallbacks/Load";
import { getBlogs } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";

export default async function AdminBlog({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");

  const page = Number((await searchParams).page || 1);

  let { blogs, totalPages } = await getBlogs({ page, limit: 2 });
  if (session?.user?.role === "editor") {
    ({ blogs, totalPages } = await getBlogs({ userId: session.user.id }));
  }

  return (
    <>
      <Suspense fallback={<Load />}>
        <List blogs={blogs} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </>
  );
}

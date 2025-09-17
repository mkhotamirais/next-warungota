import { Suspense } from "react";
import List from "../../List";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Load from "@/components/fallbacks/Load";
import { getBlogs } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";

const limit = 2;

export const generateStaticParams = async ({ params }: { params: Promise<{ page: string }> }) => {
  const page = Number((await params).page || 1);
  return Array.from({ length: page }, (_, i) => ({ page: String(i + 1) }));
};

export default async function AdminBlogPaginate({ params }: { params: Promise<{ page?: string }> }) {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");

  const page = Number((await params).page || 1);

  let { blogs, totalPages } = await getBlogs({ page, limit });
  if (session?.user?.role === "editor") {
    ({ blogs, totalPages } = await getBlogs({ userId: session.user.id }));
  }

  return (
    <>
      <Suspense fallback={<Load />}>
        <List blogs={blogs} />
      </Suspense>
      <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/blog/page" />
    </>
  );
}

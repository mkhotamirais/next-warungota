import Link from "next/link";
import { Suspense } from "react";
import List from "./List";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Button from "@/components/ui/Button";
import { getBlogByUserId, getBlogs } from "@/lib/data";
import Load from "@/components/fallbacks/Load";

export default async function AdminBlog() {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");
  // const blogs = await getBlogs();

  let blogs = null;
  if (session?.user?.role === "admin") {
    blogs = await getBlogs();
  }

  if (session?.user?.role === "editor") {
    blogs = await getBlogByUserId();
  }

  return (
    <>
      <Button as={Link} href="/dashboard/blog/create-blog">
        Create Blog
      </Button>
      <Suspense fallback={<Load />}>
        <List blogs={blogs} />
      </Suspense>
    </>
  );
}

import { auth } from "@/auth";
import Load from "@/components/fallbacks/Load";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import List from "./List";
import { getProducts } from "@/actions/product";
import Pagination from "@/components/ui/Pagination";

export default async function Product({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");

  const page = Number((await searchParams).page || 1);

  let { products, totalPages } = await getProducts({ page, limit: 2 });
  if (session?.user?.role === "editor") {
    ({ products, totalPages } = await getProducts({ userId: session.user.id }));
  }

  return (
    <>
      <Suspense fallback={<Load />}>
        <List products={products} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </>
  );
}

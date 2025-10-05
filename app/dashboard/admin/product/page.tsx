import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import List from "./List";
import { getProducts } from "@/actions/product";
import Pagination from "@/components/ui/Pagination";
import Load from "@/components/fallbacks/Load";

const limit = 8;

export default async function Product({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");

  const page = Number((await searchParams).page || 1);

  let { products, totalPages, totalProductsCount } = await getProducts({ page, limit });
  if (session?.user?.role === "editor") {
    ({ products, totalPages, totalProductsCount } = await getProducts({ page, limit, userId: session.user.id }));
  }

  return (
    <Suspense fallback={<Load />}>
      <List products={products} />
      {totalProductsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/product/page" />
      ) : null}
    </Suspense>
  );
}

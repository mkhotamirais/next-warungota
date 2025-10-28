import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { getProducts } from "@/actions/product";
import Pagination from "@/components/ui/Pagination";
import Load from "@/components/fallbacks/Load";
import ProductAdmin from "./ProductAdmin";

const limit = 8;

export default async function Product({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; keyword?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/dashboard");

  const page = Number((await searchParams).page || 1);
  const keyword = (await searchParams).keyword || "";

  const { products, totalPages, totalProductsCount } = await getProducts({ page, limit, keyword });

  return (
    <Suspense fallback={<Load />}>
      <ProductAdmin products={products} />
      {totalProductsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/admin/product/page" />
      ) : null}
    </Suspense>
  );
}

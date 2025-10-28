import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Load from "@/components/fallbacks/Load";
import ProductList from "./ProductList";

const limit = 8;

export default async function Product({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; keyword?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/dashboard");

  const page = Number((await searchParams).page) || 1;
  const keyword = (await searchParams).keyword || "";

  return (
    <Suspense fallback={<Load />}>
      <ProductList page={page} limit={limit} keyword={keyword} />   {" "}
    </Suspense>
  );
}

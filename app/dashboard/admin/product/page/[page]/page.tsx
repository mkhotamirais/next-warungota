import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import ProductList from "../../ProductList";
import LoadSearchProduct from "../../LoadSearchProduct";
import ProductMsg from "../../ProductMsg";
import Button from "@/components/ui/Button";
import Link from "next/link";
import SearchProductAdmin from "../../SearchProductAdmin";

const limit = 8;

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ page?: string }>;
  searchParams: Promise<{ keyword?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");

  const page = Number((await params).page || 1);
  const keyword = (await searchParams).keyword || "";

  return (
    <>
      <ProductMsg />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="h2">Product List</h2>
        <Button as={Link} href="/dashboard/admin/product/create-product">
          Create Product
        </Button>
      </div>
      <div className="mb-4">
        <SearchProductAdmin />
      </div>
      <Suspense fallback={<LoadSearchProduct />} key={keyword}>
        <ProductList page={page} limit={limit} keyword={keyword} />   {" "}
      </Suspense>
    </>
  );
}

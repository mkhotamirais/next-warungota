import { auth } from "@/auth";
import Load from "@/components/fallbacks/Load";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import List from "./List";
import { getProducts } from "@/actions/product";

export default async function Product() {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");
  // const blogs = await getProducts();

  let products = null;
  if (session?.user?.role === "admin") {
    products = await getProducts();
  }

  if (session?.user?.role === "editor") {
    products = await getProducts();
  }
  return (
    <Suspense fallback={<Load />}>
      <List products={products} />
    </Suspense>
  );
}

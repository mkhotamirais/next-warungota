"use client";

import { useProductCategory } from "@/hooks/tanstack/useProductCategory";
import React from "react";
import CreateProductForm from "./CreateProductForm";
import { redirect } from "next/navigation";

export default function CreateProductWrapper() {
  const { data: productCategories, isPending } = useProductCategory();
  if (isPending) return <div>Loading...</div>;
  if (!productCategories) return redirect("/admin/product-category");
  return <CreateProductForm productCategories={productCategories || []} />;
}

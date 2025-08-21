import React, { Suspense } from "react";
import ProductCategoryList from "./List";
import { getProductCategories } from "@/lib/data";
import Load from "@/components/fallbacks/Load";
import Create from "./Create";

export default async function ProductCategory() {
  const productCategories = await getProductCategories();

  return (
    <>
      <Create />
      <Suspense fallback={<Load />}>
        <ProductCategoryList productCategories={productCategories} />
      </Suspense>
    </>
  );
}

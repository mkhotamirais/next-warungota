import React, { Suspense } from "react";
import ProductCategoryList from "./List";
import Load from "@/components/fallbacks/Load";
import Create from "./Create";
import { getProductTags } from "@/lib/data";

export default async function ProductCategory() {
  const productTags = await getProductTags();

  return (
    <>
      <Create />
      <Suspense fallback={<Load />}>
        <ProductCategoryList productTags={productTags} />
      </Suspense>
    </>
  );
}

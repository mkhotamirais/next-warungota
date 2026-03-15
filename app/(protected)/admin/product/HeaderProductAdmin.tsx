"use client";

import AuthTitleHeader from "../../AuthTitleHeader";
import { useProduct } from "@/hooks/tanstack/useProduct";

export default function HeaderProductAdmin() {
  const { data } = useProduct();
  const { totalProductsCount: total } = data || {};

  return (
    <div className="flex justify-between items-center mb-4">
      <AuthTitleHeader
        title="Product"
        totalCount={total || 0}
        url="/admin/product/create-product"
        label="Create Product"
      />
      {/* <SearchProductAdmin /> */}
    </div>
  );
}

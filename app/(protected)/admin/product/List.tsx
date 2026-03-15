"use client";

import Pagination from "@/components/ui/custom/PaginationInput";
import { ProductProps } from "@/types/product";
import ProductCardAdmin from "./ProductCardAdmin";
// import ExportPdfButton from "@/components/exported/ExportPdfButton";
// import ExportExcelButton from "@/components/exported/ExportExcelButton";
// import ExportExcelProButton from "@/components/exported/ExportExcelProButton";

// import { useProduct } from "@/hooks/tanstack-hooks/useProduct";
// import { useParams, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

interface ProductListProps {
  products: ProductProps[];
  allProducts: ProductProps[];
  page: number;
  limit: number;
  keyword?: string;
  totalPages: number;
  totalProductsCount: number;
}

export default function List({ products, page, limit, totalPages, totalProductsCount }: ProductListProps) {
  // export default function ProductList() {
  // const searchParams = useSearchParams();
  // const params = useParams();
  // const page = Number(params.page || 1);
  // const limit = Number(searchParams.get("limit") || 8);
  // const keyword = searchParams.get("keyword");

  // const { data, isLoading } = useProduct(page, limit, keyword || "");
  // const products = data?.products as ProductProps[];
  // const totalPages = data?.totalPages as number;
  // const totalProductsCount = data?.totalProductsCount as number;

  // if (isLoading) return <h2>Loading...</h2>;

  return (
    <>
      {/* <div>
        <ExportPdfButton products={products} />
        <ExportExcelButton products={products} />
        <ExportExcelProButton products={allProducts} />
      </div> */}
      <div>
        {products?.length ? (
          <div className="grid grid-cols-2 gap-2">
            {products?.map((product) => (
              <ProductCardAdmin key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <h2>No Product Found</h2>
        )}
      </div>
      {totalProductsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/admin/product/page" />
      ) : null}
    </>
  );
}

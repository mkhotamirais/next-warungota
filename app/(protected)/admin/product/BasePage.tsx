"use client";

import { useProduct } from "@/hooks/tanstack/useProduct";
import List from "./List";

interface Props {
  page: number;
  limit: number;
  keyword?: string;
  keywordAdmin?: string;
}

export default function BasePage({ page, limit, keyword, keywordAdmin }: Props) {
  const { data, isLoading } = useProduct({ page, limit, keyword, keywordAdmin });
  const { products, totalPages, totalProductsCount } = data || {};

  const { data: data2 } = useProduct({ sortData: "name_asc" }) || {};
  const { products: allProducts } = data2 || {};

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <List
      products={products}
      allProducts={allProducts}
      totalPages={totalPages}
      totalProductsCount={totalProductsCount}
      page={page}
      limit={limit}
      keyword={keyword}
    />
  );
}

// 1. app/dashboard/admin/product/ProductList.tsx (Server Component)
import { getProducts } from "@/actions/product";
import ProductAdmin from "./ProductAdmin";
import Pagination from "@/components/ui/Pagination";

interface ProductListProps {
  page: number;
  limit: number;
  keyword: string;
}

export default async function ProductList({ page, limit, keyword }: ProductListProps) {
  const { products, totalPages, totalProductsCount } = await getProducts({ page, limit, keyword });

  return (
    <>
      <ProductAdmin products={products} />
      {totalProductsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/admin/product/page" />
      ) : null}
    </>
  );
}

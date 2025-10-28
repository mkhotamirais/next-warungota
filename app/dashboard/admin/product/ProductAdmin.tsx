"use client";

import Link from "next/link";
import { ProductProps } from "@/types/types";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useProduct } from "@/hooks/useProduct";
import ProductCardAdmin from "./ProductCardAdmin";
import SearchProductAdmin from "./SearchProductAdmin";

export default function ProductAdmin({ products }: { products: ProductProps[] | undefined | null }) {
  const { successMsg, errorMsg } = useProduct();

  return (
    <div>
      <div className="my-1">
        {successMsg ? <Msg msg={successMsg} /> : null}
        {errorMsg ? <Msg msg={errorMsg} error /> : null}
      </div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="h2">Product List</h2>
        <Button as={Link} href="/dashboard/admin/product/create-product">
          Create Product
        </Button>
      </div>
      <div className="mb-4">
        <SearchProductAdmin />
      </div>
      <div>
        {products?.length ? (
          <div>
            {products?.map((product) => (
              <ProductCardAdmin key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <h2>No Product Found</h2>
        )}
      </div>
    </div>
  );
}

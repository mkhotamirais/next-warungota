"use client";

import React from "react";
import Delete from "./Delete";
import Button from "@/components/ui/Button";
import { HiDotsVertical } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { ProductProps } from "@/types/types";
import { formatRupiah, smartTrim } from "@/lib/utils";
import { useGlobal } from "@/hooks/useGlobal";

export default function ProductCardAdmin({ product }: { product: ProductProps }) {
  const { setOpenLayer, openMoreProductOption, setOpenMoreProductOption } = useGlobal();

  const openMoreOptions = (id: string) => {
    setOpenMoreProductOption(id);
    setOpenLayer(true);
  };

  const closeMoreOptions = () => {
    setOpenMoreProductOption(null);
    setOpenLayer(false);
  };
  return (
    <div key={product.id} className="mb-2">
      <div className="flex justify-between items-center w-full border border-gray-300 bg-gray-100 rounded">
        <div className="flex gap-2 w-full p-1">
          <Link href={`/product/detail/${product.slug}`} className="">
            <Image
              src={product?.imageUrl || "/logo-warungota.png"}
              alt={product.name}
              width={50}
              height={50}
              className="size-14 min-w-14"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <Link href={`/product/detail/${product.slug}`} className="hover:underline">
              <h3 className="font-semibold first-letter:capitalize">
                {smartTrim(product.name, 40)} - Rp{formatRupiah(product.price)}
              </h3>
            </Link>
            <div className="text-sm text-gray-600 flex gap-2">
              <span>{product.ProductCategory?.name || "category"}</span>
              <span>•</span>
              <span>{product.User.name}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => openMoreOptions(product.id)}
            type="button"
            className="p-2 m-2 h-full hover:bg-gray-200 rounded"
            aria-label="more"
          >
            <HiDotsVertical />
          </button>
          <div
            className={`${
              openMoreProductOption === product.id ? "visible opacity-100" : "invisible opacity-0"
            } absolute flex flex-col gap-1 top-full right-0 bg-white border border-gray-300 rounded p-2 z-50`}
          >
            <Button as={Link} onClick={closeMoreOptions} href={`/dashboard/admin/product/edit-product/${product.slug}`}>
              Edit
            </Button>
            <Delete product={product} closeMoreOptions={closeMoreOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

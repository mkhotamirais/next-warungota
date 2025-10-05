"use client";

import Image from "next/image";
import Delete from "./Delete";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import { ProductProps } from "@/types/types";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useProduct } from "@/hooks/useProduct";
import { smartTrim } from "@/lib/utils";
import { useGlobal } from "@/hooks/useGlobal";

export default function List({ products }: { products: ProductProps[] | undefined | null }) {
  const { setOpenLayer, openMoreProductOption, setOpenMoreProductOption } = useGlobal();
  const { successMsg, errorMsg } = useProduct();

  const openMoreOptions = (id: string) => {
    setOpenMoreProductOption(id);
    setOpenLayer(true);
  };

  const closeMoreOptions = () => {
    setOpenMoreProductOption(null);
    setOpenLayer(false);
  };

  if (!products?.length) return <h2 className="h2">No Product Found</h2>;

  return (
    <div>
      <div className="my-1">
        {successMsg ? <Msg msg={successMsg} /> : null}
        {errorMsg ? <Msg msg={errorMsg} error /> : null}
      </div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="h2">Product List</h2>
        <Button as={Link} href="/dashboard/product/create-product">
          Create Product
        </Button>
      </div>
      <div>
        {products?.map((product) => (
          <div key={product.id} className="mb-2">
            <div className="flex justify-between items-center w-full border border-gray-300 bg-gray-100 rounded">
              <div className="flex gap-2 w-full p-1">
                <Link href={`/product/detail/${product.slug}`} className="">
                  <Image
                    src={product?.imageUrl || "/logo-warungota.png"}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="size-14"
                  />
                </Link>
                <div className="flex flex-col gap-1">
                  <Link href={`/product/detail/${product.slug}`} className="hover:underline">
                    <h3 className="h3">{smartTrim(product.name, 40)}</h3>
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
                  <Button as={Link} onClick={closeMoreOptions} href={`/dashboard/product/edit-product/${product.slug}`}>
                    Edit
                  </Button>
                  <Delete product={product} closeMoreOptions={closeMoreOptions} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

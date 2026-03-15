"use client";

import { HiDotsVertical } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { ProductProps } from "@/types/product";
import { formatRupiah, smartTrim } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Delete from "./Delete";
import { ImageIcon } from "lucide-react";

export default function ProductCardAdmin({ product }: { product: ProductProps }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between mb-2 items-center w-full border border-gray-300 bg-white rounded">
      <div className="flex gap-2 w-full p-1 items-center">
        <Link href={`/product-detail/${product.slug}`} className="size-12 flex items-center justify-center">
          {product?.imageUrl ? (
            <Image
              src={product?.imageUrl || "/images/logo-warungota.png"}
              alt={product.name}
              width={50}
              height={50}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <ImageIcon className="size-12" />
          )}
        </Link>
        <div className="flex flex-col gap-1">
          <Link href={`/product-detail/${product.slug}`} className="hover:underline">
            <h3 className="first-letter:capitalize leading-none">{smartTrim(product.name, 45)}</h3>
          </Link>
          <p className="font-semibold">Rp{formatRupiah(product.price)}</p>
          {/* <div className="text-sm text-gray-600 flex gap-2">
              <span>{product.ProductCategory?.name || "category"}</span>
              <span>•</span>
              <span>{product.User.name}</span>
            </div> */}
        </div>
      </div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="mr-1" asChild>
          <Button variant="ghost" type="button" aria-label="more" size="icon">
            <HiDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/product/edit-product/${product.slug}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild variant="destructive">
            <Delete product={product} setOpen={setOpen} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

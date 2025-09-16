import { formatRupiah } from "@/lib/utils";
import { ProductProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProductCard({ item }: { item: ProductProps }) {
  return (
    <div key={item.id} className="shadow rounded">
      <Link href={`/product/detail/${item.slug}`}>
        <Image
          src={item.imageUrl || ""}
          alt={item.name}
          width={400}
          height={400}
          className="bg-white rounded-t object-cover object-center w-full h-72"
        />
      </Link>
      <div className="p-3">
        <Link href={`/product/detail/${item.slug}`} className="hover:underline">
          <h3 className="h3">{item.name}</h3>
        </Link>
        <p className="text-2xl font-semibold">{formatRupiah(item.price)}</p>
      </div>
    </div>
  );
}

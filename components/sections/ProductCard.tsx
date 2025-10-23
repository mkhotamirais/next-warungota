import { formatRupiah, smartTrim } from "@/lib/utils";
import { ProductProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProductCard({ item }: { item: ProductProps }) {
  return (
    <div key={item.id} className="shadow rounded">
      <Link href={`/product/detail/${item.slug}`} className="w-full h-36 block">
        <Image
          src={item.imageUrl || "/logo-warungota.png"}
          alt={item.name}
          width={400}
          height={400}
          className="w-full h-full rounded-t object-contain object-center bg-gray-100"
        />
      </Link>
      <div className="px-3 py-2 flex flex-col min-h-20">
        <Link href={`/product/detail/${item.slug}`} className="hover:underline">
          <h3 className="capitalize">{smartTrim(item.name, 36)}</h3>
        </Link>
        <p className="font-semibold mt-auto">{formatRupiah(item.price)}</p>
      </div>
    </div>
  );
}

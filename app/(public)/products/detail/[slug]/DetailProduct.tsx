"use client";

import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { SingleProductProps } from "@/types/product";
// import AddToCartFromProductDetail from "@/components/AddToCartFromProductDetail";

export default function DetailProduct({ product }: { product: SingleProductProps }) {
  const { data: session } = useSession();

  return (
    <div className="py-6 bg-gray-100">
      <div className="container flex flex-col sm:flex-row gap-8 bg-white rounded-md p-4">
        <div className="w-full sm:w-2/5">
          <div className="rounded-md h-120">
            <Image
              src={product.imageUrl || "/images/logo-warungota.png"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-contain object-center"
            />
          </div>
        </div>

        <div className="w-full sm:w-3/5 space-y-4">
          <h1 className="text-lg md:text-2xl font-semibold capitalize">{product.name}</h1>
          <p className="text-2xl md:text-3xl font-medium text-primary">
            <span className="text-base">Rp</span>
            {product.price > 0 ? `${formatRupiah(product.price)}` : "Diskon"}
          </p>

          {session?.user.role === "USER" ? (
            <div>
              {/* <AddToCart product={product} /> */}
              {/* <AddToCartFromProductDetail product={product} /> */}
            </div>
          ) : null}
          <article dangerouslySetInnerHTML={{ __html: product.description || "" }}></article>
        </div>
      </div>
    </div>
  );
}

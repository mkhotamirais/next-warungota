"use client";

import Image from "next/image";
import React, { useState } from "react";
import AddToCart from "./AddToCart";
import { formatRupiah } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { ProductProps } from "@/types/types";

export default function DetailProduct({ product }: { product: ProductProps }) {
  const { data: session } = useSession();
  let price = 0;
  let maxPrice = 0;
  if (product.ProductVariant.length === 1) {
    price = product.ProductVariant[0].price;
    maxPrice = 0;
  }
  if (product.ProductVariant.length > 1) {
    price = Math.min(...product.ProductVariant.map((item) => item.price));
    maxPrice = Math.max(...product.ProductVariant.map((item) => item.price));
  }

  const [showName, setShowName] = useState(product.name);
  const [showPrice, setShowPrice] = useState(price);
  const [showMaxPrice, setShowMaxPrice] = useState(maxPrice);
  const [showImageUrl, setShowImageUrl] = useState(product.imageUrl);

  const handleSelectVariant = (id: string | null) => {
    const selected = product.ProductVariant.find((item) => item.id === id);

    if (selected) {
      setShowName(
        `${product.name} - ${selected.Options.map((item) => item.VariationOption.VariationType.name).join(" ")} ${selected.Options.map((item) => item.VariationOption.value).join(" ")}`
      );
      setShowPrice(selected.price);
      setShowMaxPrice(0);
      setShowImageUrl(selected.variantImageUrl);
    } else {
      setShowName(product.name);
      setShowPrice(price);
      setShowMaxPrice(maxPrice);
      setShowImageUrl(product.imageUrl);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-8">
      <div className="w-full sm:w-1/2">
        <div className="rounded border border-gray-300 mb-2">
          <Image
            src={showImageUrl || "/logo-warungota.png"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-72 object-contain object-center"
          />
        </div>
        <div className="flex gap-1 p-1 border border-gray-300 rounded overflow-x-auto">
          <button
            type="button"
            aria-label="unselect-variant"
            onClick={() => handleSelectVariant(null)}
            className="min-w-20 h-20 block"
          >
            <Image
              src={product.imageUrl || "/logo-warungota.png"}
              width={100}
              height={100}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </button>
          {product.ProductVariant.map((item) => (
            <button
              type="button"
              aria-label="select-variant"
              onClick={() => handleSelectVariant(item.id)}
              key={item.id}
              className="min-w-20 h-20 block"
            >
              <Image
                src={item.variantImageUrl || "/logo-warungota.png"}
                width={100}
                height={100}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="w-full sm:w-1/2">
        <h1 className="text-lg font-semibold capitalize">{showName}</h1>
        <p className="text-2xl font-medium">
          <span className="text-base">Rp</span>
          {formatRupiah(showPrice)} {showMaxPrice > 0 && <span className=""> - {formatRupiah(showMaxPrice)}</span>}
        </p>

        {session?.user.role === "USER" ? (
          <div>
            <AddToCart product={product} />
          </div>
        ) : null}
        <article dangerouslySetInnerHTML={{ __html: product.description || "" }}></article>
      </div>
    </div>
  );
}

"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import React from "react";
import { LuShoppingCart } from "react-icons/lu";

export default function CartBtnClient({ cartQty }: { cartQty: number }) {
  const { pending } = useCart();
  return (
    <Link href="/product/cart" className={`${pending ? "animate-ping" : ""} transition-all relative py-2 px-3 text-lg`}>
      <span className="text-[10px] py-[1px] px-1 bg-red-500 text-white absolute right-0 -top-1 rounded">{cartQty}</span>
      <LuShoppingCart />
    </Link>
  );
}

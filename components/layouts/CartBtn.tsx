"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { useEffect } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { useSession } from "next-auth/react";

export default function CartBtn() {
  const { cartQty, setCartQty, pending, setPending } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    // if (session === undefined) return;

    setPending(true);

    const getCarts = async () => {
      try {
        const res = await fetch("/api/cart");

        if (!res.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const data = await res.json();
        setCartQty(data.cartQty);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartQty(0);
      } finally {
        setPending(false);
      }
    };

    getCarts();
  }, [setCartQty, setPending, session, session?.user?.id]);

  const cartBadge = (
    <span className="text-[10px] py-[1px] px-1 bg-red-500 text-white absolute right-0 -top-1 rounded">{cartQty}</span>
  );

  return (
    <Link
      href="/product/cart"
      className={`transition-all relative py-2 px-3 text-lg ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={(e) => pending && e.preventDefault()}
    >
      <LuShoppingCart />
      {pending ? (
        <span className="text-[10px] py-[1px] px-1 bg-gray-400 text-white absolute right-0 -top-1 rounded">...</span>
      ) : (
        cartQty > 0 && cartBadge
      )}
    </Link>
  );
}

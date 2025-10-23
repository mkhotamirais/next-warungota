"use client";

import { useRouter } from "next/navigation";
import { CartItemProps } from "@/types/types";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import CartList from "./CartList";
import { useEffect } from "react";
import { formatRupiah } from "@/lib/utils";

interface InteractiveCartProps {
  cartItems: CartItemProps[];
  cartQty: number;
  totalPrice: number;
}

export default function InteractiveCart({ cartItems, cartQty, totalPrice }: InteractiveCartProps) {
  const router = useRouter();
  const { setCartQty, setPendingSaving, setPendingSave, setPendingDel, pendingCheckout, setPendingCheckout } =
    useCart();

  useEffect(() => {
    setCartQty(cartQty);
  }, [setCartQty, cartQty]);

  const handleUpdate = async (itemToUpdate: CartItemProps, newQty: number, check: boolean) => {
    setPendingCheckout(true);
    setPendingSaving(itemToUpdate.productId);
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: itemToUpdate.productId, qty: newQty, check }),
      });

      if (!res.ok) {
        throw new Error("Failed to update cart item");
      }
      router.refresh();
    } catch (error) {
      console.log(error);
      alert("Gagal memperbarui keranjang.");
    } finally {
      setTimeout(() => {
        setPendingCheckout(false);
        setPendingSave(null);
        setPendingSaving(null);
      }, 1500);
    }
  };

  const handleDeleteItem = async (productId: string) => {
    if (confirm("Apakah kamu yakin ingin menghapus item ini?")) {
      setPendingDel(productId);

      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        const res = await fetch("/api/cart", { method: "GET" });
        const result = await res.json();
        if (result.cartItems.length === 0) {
          setCartQty(0);
        }
        router.refresh();
      } catch (error) {
        console.log(error);
        alert("Gagal menghapus item dari keranjang.");
      } finally {
        setTimeout(() => {
          setPendingDel(null);
        }, 1500);
      }
    }
    return;
  };

  const handleCheckout = () => {
    router.push("/product/checkout");
  };

  return (
    <>
      <div className="">
        {cartItems?.length > 0 ? (
          cartItems.map((item) => (
            <CartList
              item={item}
              key={item.productId}
              handleUpdate={handleUpdate}
              handleDeleteItem={handleDeleteItem}
            />
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">
            Keranjang kamu kosong.
            <Link href="/" className="underline ml-2">
              Belanja sekarang!
            </Link>
          </div>
        )}
      </div>
      {cartItems?.length > 0 && (
        <div className="sticky bottom-0 py-4 border-t flex items-center justify-between bg-white">
          <div className="flex flex-col">
            <span>Total Price</span>
            <span>{formatRupiah(totalPrice)}</span>
          </div>
          <div>
            <button
              type="button"
              onClick={handleCheckout}
              className="py-2 px-3 bg-primary text-white rounded disabled:bg-gray-400"
              disabled={pendingCheckout || totalPrice === 0 || cartItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

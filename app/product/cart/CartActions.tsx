// components/CartActions.tsx
"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { CartItemProps } from "@/types/types";
import { useCart } from "@/hooks/useCart";

export default function CartActions({ item }: { item: CartItemProps }) {
  const [qty, setQty] = useState(item.quantity.toString());
  const router = useRouter();
  const { setPendingCheckout } = useCart();

  const handleUpdate = async (newQty: number) => {
    setPendingCheckout(true); // Mulai loading, disable tombol Checkout
    setQty(newQty.toString());

    if (newQty < 1) {
      if (confirm("Apakah kamu yakin ingin menghapus item ini?")) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.productId }),
        });
        router.refresh();
      } else {
        setQty(item.quantity.toString());
      }
      setPendingCheckout(false); // Selesai loading
      return;
    }

    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: item.productId, qty: newQty }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Gagal memperbarui keranjang.");
      setQty(item.quantity.toString());
    }
    setPendingCheckout(false); // Selesai loading
  };

  const handleInputUpdate = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent<HTMLInputElement>).key !== "Enter") {
      return; // Hanya proses jika tombol Enter ditekan
    }

    const newQty = parseInt((e.target as HTMLInputElement).value);
    if (isNaN(newQty) || newQty < 1) {
      alert("Masukkan kuantitas yang valid.");
      setQty(item.quantity.toString());
      return;
    }
    handleUpdate(newQty);
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => handleUpdate(parseInt(qty) - 1)} aria-label="Decrement">
        <FaChevronLeft />
      </button>
      <input
        name="qty"
        aria-label="qty"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={qty}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || /^\d*$/.test(value)) {
            setQty(value);
          }
        }}
        onBlur={(e) => {
          setPendingCheckout(false); // Selesai fokus, bisa juga digunakan untuk memicu update
          handleInputUpdate(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Mencegah form submit
            handleInputUpdate(e);
            (e.target as HTMLInputElement).blur();
          }
        }}
        onFocus={(e) => {
          e.target.select();
          setPendingCheckout(true); // Mulai fokus, disable tombol Checkout
        }}
        className="w-12 text-center border rounded"
      />
      <button type="button" onClick={() => handleUpdate(parseInt(qty) + 1)} aria-label="Increment">
        <FaChevronRight />
      </button>
      <button type="button" onClick={() => handleUpdate(0)} className="text-red-500 ml-4">
        Hapus
      </button>
    </div>
  );
}

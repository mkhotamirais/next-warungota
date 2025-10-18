"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function AddToCart({ productId }: { productId: string }) {
  const [qty, setQty] = useState("1");
  const [pending, startTransition] = useTransition();
  const { setPending } = useCart();
  const router = useRouter();

  const handleIncrement = () => {
    const newQty = Number(qty) + 1;
    setQty(String(newQty));
  };

  const handleDecrement = () => {
    const newQty = Number(qty) - 1;
    if (newQty >= 1) {
      setQty(String(newQty));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      setPending(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      });
      if (res.status === 401) {
        router.push("/signin");
        return;
      } else if (res.ok) {
        // router.push("/product/cart");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Gagal menambahkan produk: ${errorData.message}`);
      }
      setPending(false);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="my-4">
        <div className="mb-3 flex gap-2 items-center">
          <label htmlFor="quantity" className="mr-2">
            Quantity
          </label>
          <div className="flex border rounded border-gray-500">
            <button type="button" aria-label="decrement" className="px-2 text-sm" onClick={handleDecrement}>
              <FaChevronLeft />
            </button>
            <input
              id="quantity"
              name="quantity"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder=""
              value={qty}
              onChange={(e) => {
                if (Number(e.target.value) < 0) {
                  alert("Tidak bisa kurang dari 0");
                  return;
                }
                if (isNaN(Number(e.target.value))) {
                  alert("Please enter a valid number");
                  return;
                }
                setQty(e.target.value);
              }}
              onFocus={(e) => e.target.select()}
              className="border-x py-1 px-3 w-14 text-center"
            />
            <button type="button" aria-label="increment" className="px-2 text-sm" onClick={handleIncrement}>
              <FaChevronRight />
            </button>
          </div>
        </div>
        <button type="submit" className="py-2 px-3 bg-primary text-white rounded" disabled={pending}>
          {pending ? "Adding..." : "Add To Cart"}
        </button>
      </form>
    </div>
  );
}

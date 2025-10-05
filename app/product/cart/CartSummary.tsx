// components/CartSummary.tsx
"use client";

import { useCart } from "@/hooks/useCart";

export default function CartSummary({ totalPrice }: { totalPrice: number }) {
  const { pendingCheckout } = useCart();

  return (
    <div className="sticky bottom-0 py-4 border-t flex items-center justify-between bg-white">
      <div className="flex flex-col">
        <span>Total Price</span>
        <span>Rp {totalPrice}</span>
      </div>
      <div>
        <button className="py-2 px-3 bg-primary text-white rounded disabled:bg-gray-400" disabled={pendingCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

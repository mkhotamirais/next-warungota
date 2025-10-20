import { getCarts } from "@/actions/cart";
import InteractiveCart from "./InteractiveCart";
import { Suspense } from "react";
import LoadCart from "@/components/fallbacks/LoadCart";

export default async function Cart() {
  const { cartQty, cartItems, totalPrice } = await getCarts();

  if (!cartItems || cartItems?.length === 0) {
    return (
      <section>
        <div className="container max-w-xl py-4">
          <h1 className="h1 mb-4">Cart</h1>
          <p className="">Your cart is empty.</p>
        </div>
      </section>
    );
  }

  const orderedCartItemsByChecked = [...cartItems].sort((a, b) => {
    if (a.isChecked === b.isChecked) return 0;
    return a.isChecked ? -1 : 1;
  });

  return (
    <section>
      <div className="container max-w-xl py-4">
        <h1 className="h1 mb-4">Cart</h1>
        <Suspense fallback={<LoadCart />}>
          <InteractiveCart cartItems={orderedCartItemsByChecked} cartQty={cartQty} totalPrice={totalPrice} />
        </Suspense>
      </div>
    </section>
  );
}

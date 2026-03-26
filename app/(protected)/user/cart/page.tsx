import { Suspense } from "react";
import LoadCart from "@/components/fallbacks/LoadCart";
// import CartWrapper from "./CartWrapper";
// import InteractiveCart from "./InteractiveCart";

export const dynamic = "force-dynamic";

export default async function Cart() {
  return (
    <div className="max-w-xl px-2 mx-auto">
      <h1 className="h1 mb-4">Cart</h1>
      <Suspense fallback={<LoadCart />}>
        {/* <CartWrapper /> */}
        {/* <InteractiveCart /> */}
      </Suspense>
    </div>
  );
}

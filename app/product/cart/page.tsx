import { getCarts } from "@/actions/cart";
import InteractiveCart from "./InteractiveCart";

export default async function Cart() {
  const { cartItems } = await getCarts();

  if (!cartItems || cartItems?.length === 0) return <h1 className="h1">Keranjangmu masih kosong</h1>;

  return (
    <section>
      <div className="container max-w-xl py-4">
        <h1 className="h1 mb-4">Cart</h1>
        <InteractiveCart cartItems={cartItems} />
      </div>
    </section>
  );
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { getCarts } from "@/actions/cart";
import { getUserAddresses } from "@/actions/address";
import CheckoutSummary from "./CheckoutSummary";
import AddressSelector from "./AddressSelector";
import SelectedCartItems from "./SelectedCartItems";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  const { cartItems, totalPrice } = await getCarts();
  const addresses = await getUserAddresses();

  if (cartItems?.length === 0) redirect("/product/cart");

  const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0] || null;

  const shippingCost = 15000;
  const finalTotal = totalPrice + shippingCost;

  return (
    <main className="container mx-auto py-8">
      <h1 className="h1">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">1. Pilih Alamat Pengiriman</h2>
            <AddressSelector initialAddresses={addresses} defaultAddress={defaultAddress} />
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">2. Item Belanja ({cartItems?.length})</h2>
            <SelectedCartItems cartItems={cartItems} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <CheckoutSummary subtotal={totalPrice} shippingCost={shippingCost} finalTotal={finalTotal} />
        </div>
      </div>
    </main>
  );
}

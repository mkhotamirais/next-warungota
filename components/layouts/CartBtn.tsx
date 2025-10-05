import { getCarts } from "@/actions/cart";
import CartBtnClient from "./CartBtnClient";

export default async function CartBtn() {
  const { cartQty } = await getCarts();

  return <CartBtnClient cartQty={cartQty} />;
}

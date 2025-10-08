"use client";

import { useMemo, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { CartItemProps } from "@/types/types";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { FaTrashAlt } from "react-icons/fa";

export default function InteractiveCart({ cartItems, cartQty }: { cartItems: CartItemProps[]; cartQty: number }) {
  const router = useRouter();
  const { setCartQty, pendingCheckout, setPendingCheckout, selectedItems, toggleItem, setSelectedItems } = useCart();

  useEffect(() => {
    const currentProductIds = cartItems.map((item) => item.Product.id);
    const newSelectedItems = selectedItems.filter((id) => currentProductIds.includes(id));

    if (newSelectedItems.length !== selectedItems.length) {
      setSelectedItems(newSelectedItems);
    }
  }, [cartItems, selectedItems, setSelectedItems]);

  const sortedCartItems = useMemo(() => {
    const selected = cartItems.filter((item) => selectedItems.includes(item.Product.id));
    const unselected = cartItems.filter((item) => !selectedItems.includes(item.Product.id));
    return [...selected, ...unselected];
  }, [cartItems, selectedItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.Product.id)) {
        return total + item.quantity * item.Product.price;
      }
      return total;
    }, 0);
  }, [cartItems, selectedItems]);

  const handleUpdate = async (itemToUpdate: CartItemProps, newQty: number) => {
    if (newQty < 1) {
      setPendingCheckout(itemToUpdate.productId);
      if (confirm("Apakah kamu yakin ingin menghapus item ini?")) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: itemToUpdate.productId }),
        });
        router.refresh();
      }
      setPendingCheckout(null);
      return;
    }

    setPendingCheckout(itemToUpdate.productId);
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: itemToUpdate.productId, qty: newQty }),
    });

    if (res.ok) {
      setCartQty(cartQty);
      router.refresh();
    } else {
      alert("Gagal memperbarui keranjang.");
    }
    setPendingCheckout(null);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>, itemToUpdate: CartItemProps) => {
    const newQty = parseInt(e.target.value);
    if (isNaN(newQty) || newQty < 1) {
      alert("Masukkan kuantitas yang valid.");
      e.target.value = itemToUpdate.quantity.toString();
      return;
    }
    handleUpdate(itemToUpdate, newQty);
    setPendingCheckout(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, itemToUpdate: CartItemProps) => {
    if (pendingCheckout === "checkout" || pendingCheckout === itemToUpdate.productId) return;
    if (e.key === "Enter") {
      e.preventDefault();
      const newQty = parseInt(e.currentTarget.value);
      if (isNaN(newQty) || newQty < 1) {
        alert("Masukkan kuantitas yang valid.");
        e.currentTarget.value = itemToUpdate.quantity.toString();
        return;
      }
      handleUpdate(itemToUpdate, newQty);
      e.currentTarget.blur();
      setPendingCheckout(null);
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Pilih setidaknya satu item untuk checkout.");
      return;
    }

    setPendingCheckout("checkout");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Kirim daftar ID produk yang dipilih ke backend
        body: JSON.stringify({ selectedProductIds: selectedItems }),
      });

      if (res.status === 401) {
        router.push("/signin");
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setSelectedItems([]);

        router.push(`/order/confirmation?orderId=${data.orderId}`);
      } else {
        alert(`Checkout gagal: ${data.message || "Terjadi kesalahan server."}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setPendingCheckout(null);
    }
  };

  return (
    <>
      <div className="">
        {cartItems?.length > 0 ? (
          sortedCartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-4 border-b pb-4">
              <div className="flex gap-4 items-center">
                <input
                  aria-label="Checkbox"
                  type="checkbox"
                  checked={selectedItems.includes(item.Product.id)}
                  onChange={() => toggleItem(item.Product.id)}
                  className="size-5"
                />
                <Image
                  src={item.Product.imageUrl || "/logo-warungota.png"}
                  alt={item.Product.name}
                  width={100}
                  height={100}
                  className="size-20 object-cover object-center"
                />
                <div className="space-y-2">
                  <Link href={`/product/detail/${item.Product.slug}`} className="hover:underline">
                    <h3 className="capitalize font-semibold">{item.Product.name}</h3>
                  </Link>
                  <p>Rp {item.Product.price}</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleUpdate(item, item.quantity - 1)} aria-label="Decrement">
                      <FaChevronLeft />
                    </button>
                    <input
                      aria-label="Quantity"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*$/.test(value)) {
                          handleUpdate(item, parseInt(value) || 0);
                        }
                      }}
                      onBlur={(e) => handleInputBlur(e, item)}
                      onKeyDown={(e) => handleKeyDown(e, item)}
                      onFocus={(e) => {
                        e.target.select();
                        setPendingCheckout("checkout");
                      }}
                      className="w-12 text-center border rounded"
                    />
                    <button type="button" onClick={() => handleUpdate(item, item.quantity + 1)} aria-label="Increment">
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
              <div className="self-start">
                <button
                  type="button"
                  onClick={() => handleUpdate(item, 0)}
                  aria-label="Delete"
                  className="text-red-500 ml-4"
                >
                  {pendingCheckout === item.Product.id ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                </button>
              </div>
            </div>
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
            <span>Rp {totalPrice}</span>
          </div>
          <div>
            <button
              type="button"
              onClick={handleCheckout}
              className="py-2 px-3 bg-primary text-white rounded disabled:bg-gray-400"
              disabled={pendingCheckout === "checkout" || totalPrice === 0 || selectedItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// components/InteractiveCart.tsx
"use client";

import { useMemo, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { CartItemProps } from "@/types/types";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { FaTrashAlt } from "react-icons/fa";

export default function InteractiveCart({ cartItems }: { cartItems: CartItemProps[] }) {
  const router = useRouter();
  const { pendingCheckout, setPendingCheckout, selectedItems, toggleItem, setSelectedItems } = useCart();

  // --- START PERUBAHAN UTAMA DI SINI ---
  useEffect(() => {
    // 1. Dapatkan ID PRODUK dari semua item yang ada di keranjang.
    const currentProductIds = cartItems.map((item) => item.Product.id);

    // 2. Filter selectedItems (yang berisi ID produk) untuk menghapus ID yang tidak lagi ada di keranjang.
    const newSelectedItems = selectedItems.filter((id) => currentProductIds.includes(id));

    // 3. Perbarui state jika ada item yang dihapus (agar checkbox terhapus dari state).
    if (newSelectedItems.length !== selectedItems.length) {
      setSelectedItems(newSelectedItems);
    }

    // CATATAN: Item yang baru ditambahkan (dari AddToCart) sudah masuk ke selectedItems melalui useCart.
    // Kita hanya perlu membersihkan item yang dihapus.
  }, [cartItems, selectedItems, setSelectedItems]);
  // --- END PERUBAHAN UTAMA DI SINI ---

  // Perubahan: Gunakan item.Product.id untuk seleksi dan pengurutan
  const sortedCartItems = useMemo(() => {
    const selected = cartItems.filter((item) => selectedItems.includes(item.Product.id));
    const unselected = cartItems.filter((item) => !selectedItems.includes(item.Product.id));
    return [...selected, ...unselected];
  }, [cartItems, selectedItems]);

  // Perubahan: Gunakan item.Product.id untuk perhitungan harga
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.Product.id)) {
        return total + item.quantity * item.Product.price;
      }
      return total;
    }, 0);
  }, [cartItems, selectedItems]);

  const handleUpdate = async (itemToUpdate: CartItemProps, newQty: number) => {
    setPendingCheckout(true);

    if (newQty < 1) {
      if (confirm("Apakah kamu yakin ingin menghapus item ini?")) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: itemToUpdate.productId }),
        });
        router.refresh();
      }
      setPendingCheckout(false);
      return;
    }

    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: itemToUpdate.productId, qty: newQty }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Gagal memperbarui keranjang.");
    }
    setPendingCheckout(false);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>, itemToUpdate: CartItemProps) => {
    const newQty = parseInt(e.target.value);
    if (isNaN(newQty) || newQty < 1) {
      alert("Masukkan kuantitas yang valid.");
      e.target.value = itemToUpdate.quantity.toString();
      return;
    }
    handleUpdate(itemToUpdate, newQty);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, itemToUpdate: CartItemProps) => {
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
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Pilih setidaknya satu item untuk checkout.");
      return;
    }

    setPendingCheckout(true);

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
        // 1. Bersihkan selectedItems di Zustand dan localStorage
        setSelectedItems([]);

        // 2. Navigasi ke halaman konfirmasi atau pembayaran
        // Sesuaikan URL ini dengan rute konfirmasi/pembayaran Anda
        router.push(`/order/confirmation?orderId=${data.orderId}`);
      } else {
        alert(`Checkout gagal: ${data.message || "Terjadi kesalahan server."}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setPendingCheckout(false);
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
                  // Perubahan: Menggunakan item.Product.id
                  checked={selectedItems.includes(item.Product.id)}
                  // Perubahan: Menggunakan item.Product.id
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
                        setPendingCheckout(true);
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
                  {pendingCheckout ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
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
              disabled={pendingCheckout || totalPrice === 0 || selectedItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

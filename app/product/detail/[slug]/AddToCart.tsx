"use client";

import Button from "@/components/ui/Button";
import Modal, { ModalClose } from "@/components/ui/Modal";
import { useCart } from "@/hooks/useCart";
import { SingleProductProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";

export default function AddToCart({ product }: { product: SingleProductProps }) {
  const pv = product.ProductVariant;
  const [qty, setQty] = useState("1");
  const [pending, startTransition] = useTransition();
  const [productVariantId, setProductVariantId] = useState<string | null>(null);
  const { setPending, cartQty, setCartQty } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (pv.length === 1) {
      setProductVariantId(pv[0].id);
    }
  }, [pv]);

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

  const handleSelectProductVariantId = (id: string) => {
    setProductVariantId(id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      setPending(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productVariantId, qty }),
        next: { tags: ["cart-summary"], revalidate: 3600 },
      });

      if (res.status === 401) {
        router.push("/signin");
        return;
      } else if (res.ok) {
        setCartQty(cartQty + Number(qty));
        setQty("1");
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
      <Modal trigger={<LuShoppingCart className="text-2xl" />} title="Add to cart">
        <form onSubmit={handleSubmit} className="my-4">
          {pv.length > 1 ? (
            <div className="flex gap-1 mb-4">
              {pv.map((v) => (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => handleSelectProductVariantId(v.id)}
                  className={`${v.id === productVariantId && "bg-primary text-white"} border border-gray-300 px-2 py-1`}
                >
                  {v.Options.map((o) => (
                    <span key={o.VariationOption.id} className="">
                      {o.VariationOption.value}
                    </span>
                  ))}
                </button>
              ))}
            </div>
          ) : null}

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
          <ModalClose asChild>
            <Button type="submit" className="" disabled={pending || !productVariantId}>
              {pending ? "Adding..." : "Add To Cart"}
            </Button>
          </ModalClose>
        </form>
      </Modal>
    </div>
  );
}

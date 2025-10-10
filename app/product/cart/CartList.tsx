"use client";

import { CartItemProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa6";

interface CartListProps {
  item: CartItemProps;
  handleUpdate: (itemToUpdate: CartItemProps, newQty: number) => void;
  handleToggleSelect: (productId: string, currentStatus: boolean) => void;
  handleDeleteItem: (productId: string) => void;
}

export default function CartList({ item, handleUpdate, handleToggleSelect, handleDeleteItem }: CartListProps) {
  const [qty, setQty] = useState(item.quantity.toString());
  const saveRef = useRef<HTMLButtonElement>(null);

  const hasUnsavedChanges = Number(qty) !== item.quantity;

  useEffect(() => {
    if (hasUnsavedChanges) {
      saveRef.current?.focus();
    }
  }, [hasUnsavedChanges]);

  const handleDecrement = () => {
    if (parseInt(qty) > 1) {
      setQty((prev) => String(Number(prev) - 1));
    }
    if (qty === "1") {
      handleDeleteItem(item.Product.id);
    }
  };

  const handleIncrement = () => {
    setQty((prev) => String(Number(prev) + 1));
  };

  const handleChange = (value: string) => {
    setQty(value);
  };

  const handleBlur = () => {
    if (qty === "" || parseInt(qty) < 1) {
      setQty(item.quantity.toString());
    }
  };

  const handleCancel = () => {
    setQty(item.quantity.toString());
  };

  const handleSave = useCallback(() => {
    const newQty = parseInt(qty);
    if (!isNaN(newQty) && newQty > 0 && newQty !== item.quantity) {
      handleUpdate(item, newQty);
    } else {
      setQty(item.quantity.toString());
    }
  }, [handleUpdate, item, qty]);

  return (
    <div key={item.id} className="flex justify-between mb-4 border-b pb-4">
      <div className="flex gap-4 items-center">
        <input
          aria-label="Checkbox"
          type="checkbox"
          checked={item.isChecked}
          onChange={() => handleToggleSelect(item.Product.id, item.isChecked)}
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
            <button type="button" onClick={handleDecrement} aria-label="Decrement">
              {qty === "1" ? <FaTrash className="text-red-500" /> : <FaChevronLeft />}
            </button>
            <input
              aria-label="Quantity"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={qty}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*$/.test(value)) {
                  handleChange(value);
                }
              }}
              onBlur={handleBlur}
              //   onKeyDown={(e) => handleKeyDown(e, item)}
              onFocus={(e) => {
                e.target.select();
                //   setPendingCheckout("checkout");
              }}
              className="w-12 text-center border rounded"
            />
            <button type="button" onClick={handleIncrement} aria-label="Increment">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      <div>
        {Number(qty) !== item.quantity ? (
          <div>
            <button type="button" ref={saveRef} onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="self-start">
            <button
              type="button"
              onClick={() => handleDeleteItem(item.Product.id)}
              aria-label="Delete"
              className="text-red-500 ml-4"
            >
              <FaTrash />
              {/* {pendingCheckout === item.Product.id ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />} */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

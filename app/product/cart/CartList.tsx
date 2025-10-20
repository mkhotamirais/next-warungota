"use client";

import { useCart } from "@/hooks/useCart";
import { CartItemProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaCheck, FaChevronLeft, FaChevronRight, FaSpinner, FaTrash, FaXmark } from "react-icons/fa6";

interface CartListProps {
  item: CartItemProps;
  handleUpdate: (itemToUpdate: CartItemProps, newQty: number, check: boolean) => void;
  handleDeleteItem: (productId: string) => void;
}

export default function CartList({ item, handleUpdate, handleDeleteItem }: CartListProps) {
  const [qty, setQty] = useState(item.quantity.toString());
  const [check, setCheck] = useState(item.isChecked);
  const { pendingSaving, pendingSave, setPendingSave, pendingDel, pendingCheckout, setPendingCheckout } = useCart();

  const saveRef = useRef<HTMLButtonElement>(null);

  const hasUnsavedChanges = Number(qty) !== item.quantity || check !== item.isChecked;

  useEffect(() => {
    if (hasUnsavedChanges) {
      saveRef.current?.focus();
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (Number(qty) !== item.quantity || check !== item.isChecked) {
      setPendingCheckout(true);
      setPendingSave(item.Product.id);
    } else {
      setPendingCheckout(false);
      setPendingSave(null);
    }
  }, [check, item.isChecked, item.quantity, qty, setPendingCheckout, setPendingSave, item.Product.id]);

  const handleChangeCheck = () => {
    setCheck((prev) => !prev);
  };

  const handleDecrement = () => {
    if (parseInt(qty) > 1) {
      setQty((prev) => String(Number(prev) - 1));
      setPendingCheckout(true);
    }
    if (qty === "1") {
      handleDeleteItem(item.Product.id);
    }
  };

  const handleIncrement = () => {
    setQty((prev) => String(Number(prev) + 1));
    setPendingCheckout(true);
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
    setCheck(item.isChecked);
    setPendingCheckout(false);
  };

  const handleSave = useCallback(() => {
    const newQty = parseInt(qty);
    if ((!isNaN(newQty) && newQty > 0 && newQty !== item.quantity) || check !== item.isChecked) {
      handleUpdate(item, newQty, check);
    } else {
      setQty(item.quantity.toString());
    }
  }, [handleUpdate, item, qty, check]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <>
      <div
        key={item.id}
        className={`flex justify-between mb-4 border-b pb-4 relative ${pendingSave !== item.Product.id && pendingCheckout ? "pointer-events-none *:opacity-50" : ""}`}
      >
        {pendingSave !== item.Product.id && pendingCheckout ? <div className="absolute inset-0"></div> : null}
        <div className={`flex gap-4 items-center`}>
          <input
            aria-label="Checkbox"
            type="checkbox"
            checked={check}
            onChange={handleChangeCheck}
            className="size-5"
          />
          <Image
            src={item.Product.imageUrl || "/logo-warungota.png"}
            alt={item.Product.name}
            width={100}
            height={100}
            className="size-20 object-cover object-center"
          />
          <div className="space-y-2 text-sm">
            <Link href={`/product/detail/${item.Product.slug}`} className="hover:underline">
              <h3 className="capitalize font-semibold">{item.Product.name}</h3>
            </Link>
            <p>Rp {item.Product.price}</p>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
                onFocus={(e) => {
                  e.target.select();
                }}
                className="w-12 text-center border rounded"
              />
              <button type="button" onClick={handleIncrement} aria-label="Increment">
                <FaChevronRight />
              </button>
              <button type="submit" aria-label="save" className="hidden"></button>
            </form>
          </div>
        </div>
        <div>
          {Number(qty) !== item.quantity || check !== item.isChecked ? (
            <div className="space-y-1">
              <button
                type="button"
                ref={saveRef}
                onClick={handleSave}
                className="bg-primary p-2 text-sm rounded text-white flex items-center justify-center"
              >
                {pendingSaving === item.Product.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                aria-label="cancel save"
                className="p-2 text-sm bg-gray-500 rounded text-white"
              >
                <FaXmark />
              </button>
            </div>
          ) : (
            <div className="self-start">
              <button
                type="button"
                onClick={() => handleDeleteItem(item.Product.id)}
                aria-label="Delete"
                className="text-red-500 p-2 border rounded border-red-500"
              >
                {pendingDel === item.Product.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

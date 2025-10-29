"use client";

import useFilterProducts from "@/hooks/useFilterProducts";
import React from "react";

export default function FilterProductPriceRange() {
  const { minPrice, maxPrice, setMinPrice, setMaxPrice } = useFilterProducts();

  const handleChangeMinPrice = (val: string) => {
    const value = val.replace(/[^0-9]/g, "");
    setMinPrice(value);
  };

  const handleChangeMaxPrice = (val: string) => {
    const value = val.replace(/[^0-9]/g, "");
    if (value < minPrice) {
      setMaxPrice(minPrice);
      return;
    }
    setMaxPrice(value);
  };

  return (
    <div>
      <h4 className="text-lg mb-2 font-semibold">Rentang Harga</h4>
      <div className="flex gap-1 items-center">
        <div>
          <label htmlFor="min-price">Min Price</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            id="min-price"
            placeholder="Haga Minimal"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            value={minPrice}
            onChange={(e) => handleChangeMinPrice(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <div>
          <label htmlFor="max-price">Max Price</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            id="min-price"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            value={maxPrice}
            placeholder={`${minPrice ? minPrice : "Harga Maksimal"}`}
            onChange={(e) => handleChangeMaxPrice(e.target.value)}
            onFocus={(e) => {
              if (Number(maxPrice) < Number(minPrice)) {
                setMaxPrice(minPrice);
              }
              setTimeout(() => {
                e.target.select();
              }, 100);
            }}
          />
        </div>
      </div>
    </div>
  );
}

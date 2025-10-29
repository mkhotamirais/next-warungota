"use client";

import useFilterProducts from "@/hooks/useFilterProducts";
import React from "react";

export default function FilterSortPrice() {
  const { sortPrice, setSortPrice } = useFilterProducts();

  const handleSortPrice = (type: "asc" | "desc" | null) => {
    if (sortPrice === type) {
      setSortPrice(null);
    } else {
      setSortPrice(type);
    }
  };

  return (
    <div>
      <h4 className="text-lg mb-2 font-semibold">Urutkan harga</h4>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => handleSortPrice("asc")}
          className={`${sortPrice === "asc" ? "bg-primary text-white" : ""} btn-filter`}
        >
          Harga Terendah
        </button>
        <button
          type="button"
          onClick={() => handleSortPrice("desc")}
          className={`${sortPrice === "desc" ? "bg-primary text-white" : ""} btn-filter`}
        >
          Harga Tertinggi
        </button>
      </div>
    </div>
  );
}

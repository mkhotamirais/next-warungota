"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function useFilterProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);

  const handleFilter = () => {
    if (category) {
      params.set("categorySlug", category);
    } else {
      params.delete("categorySlug");
    }

    if (sortPrice) {
      params.set("sortPrice", sortPrice);
    } else {
      params.delete("sortPrice");
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
      if (!maxPrice) {
        params.set("maxPrice", minPrice);
      } else {
        params.set("maxPrice", maxPrice);
      }
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const handleReset = () => {
    params.delete("keyword");
    setCategory(null);
    params.delete("categorySlug");
    setSortPrice(null);
    params.delete("sortPrice");
    setMinPrice("");
    params.delete("minPrice");
    setMaxPrice("");
    params.delete("maxPrice");
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return {
    router,
    searchParams,
    params,
    open,
    setOpen,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortPrice,
    setSortPrice,
    handleFilter,
    handleReset,
  };
}

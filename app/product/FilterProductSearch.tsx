"use client";

import useFilterProducts from "@/hooks/useFilterProducts";
import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";

export default function FilterProductSearch({ totalProductsCount }: { totalProductsCount: number }) {
  const { params, router } = useFilterProducts();
  const [keyword, setKeyword] = useState(params.get("keyword") || "");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword) {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }
    router.push(`?${params.toString()}`);
  };
  return (
    <form onSubmit={handleSearch} className="border border-gray-300 rounded flex items-center overflow-hidden">
      <input
        title="search products input"
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="px-3 py-2"
        placeholder={`Search ${totalProductsCount} products`}
      />
      <button type="submit" aria-label="search products" className="p-3 bg-primary text-white block">
        <LuSearch />
      </button>
    </form>
  );
}

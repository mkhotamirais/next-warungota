"use client";

import React, { useEffect, useRef, useState } from "react";
import { LuFilter, LuSearch, LuX } from "react-icons/lu";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCategory } from "@prisma/client";

interface FilterProductsProps {
  productCategories: ProductCategory[];
}

export default function FilterProducts({ productCategories }: FilterProductsProps) {
  const [open, setOpen] = useState(false);
  const btnFilterRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [keyword, setKeyword] = useState(params.get("keyword") || "");
  const [category, setCategory] = useState<string | null>(null);
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
        if (e.key === "Enter") {
          btnFilterRef.current?.click();
        }
      });
    }
  }, [open]);

  const handleSortPrice = (type: "asc" | "desc" | null) => {
    if (sortPrice === type) {
      setSortPrice(null);
    } else {
      setSortPrice(type);
    }
  };

  const handleCategory = (slug: string) => {
    if (category === slug) {
      setCategory(null);
    } else {
      setCategory(slug);
    }
  };

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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword) {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }
    router.push(`?${params.toString()}`);
  };

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

  const btnStyle = "border border-gray-300 py-1 px-2 rounded text-sm hover:ring-1 hover:ring-primary";

  return (
    <div className="flex items-center gap-1">
      <form onSubmit={handleSearch} className="border border-gray-300 rounded flex items-center overflow-hidden">
        <input
          title="search products input"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="px-3 py-2"
          // placeholder={`Search ${totalProductsCount} products`}
          placeholder={`Search products`}
        />
        <button type="submit" aria-label="search products" className="p-3 bg-primary text-white block">
          <LuSearch />
        </button>
      </form>
      <div className="">
        <button
          type="button"
          className="p-2.5 rounded border border-primary text-primary text-lg"
          onClick={() => setOpen(true)}
          aria-label="filter product trigger"
        >
          <LuFilter />
        </button>
        <div
          onClick={() => setOpen(false)}
          className={`${open ? "opacity-100 visible" : "opacity-0 invisible"} transition-all fixed inset-0 bg-black/10 z-50`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${open ? "translate-y-0" : "translate-y-full"} transition-all overflow-y-scroll rounded-t-lg left-0 sm:left-1/4 right-0 sm:right-1/4 bottom-0 h-3/4 bg-white absolute`}
          >
            <div className="px-4">
              <div className="sticky top-0 flex justify-between items-center left-3 py-2 right-2 bg-white">
                {/* <h3>Filter {totalProductsCount} Product</h3> */}
                <h3>Filter Product</h3>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={handleReset} className="text-sm text-primary hover:underline">
                    Reset
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    type="button"
                    aria-label="close filter"
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <LuX />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-lg mb-2 font-semibold">Urutkan harga</h4>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleSortPrice("asc")}
                      className={`${btnStyle} ${sortPrice === "asc" ? "bg-primary text-white" : ""}`}
                    >
                      Harga Terendah
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortPrice("desc")}
                      className={`${btnStyle} ${sortPrice === "desc" ? "bg-primary text-white" : ""}`}
                    >
                      Harga Tertinggi
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg mb-2 font-semibold">Kategori</h4>
                  <div className="flex gap-1 flex-wrap">
                    {productCategories?.map((c) => (
                      <button
                        type="button"
                        key={c.slug}
                        onClick={() => handleCategory(c.slug)}
                        className={`${c.slug === category ? "bg-primary text-white" : ""} ${btnStyle}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
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
                <div className="sticky bottom-0 w-full bg-white py-2">
                  <button
                    ref={btnFilterRef}
                    type="button"
                    onClick={handleFilter}
                    className="btn w-full bg-primary text-white"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

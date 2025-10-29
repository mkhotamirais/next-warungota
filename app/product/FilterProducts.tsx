"use client";

import React, { useEffect, useRef } from "react";
import { LuFilter, LuX } from "react-icons/lu";
import { ProductCategory } from "@prisma/client";
import FilterProductSearch from "./FilterProductSearch";
import useFilterProducts from "@/hooks/useFilterProducts";
import FilterSortPrice from "./FilterSortPrice";
import FilterProductCategory from "./FilterProductCategory";

interface FilterProductsProps {
  totalProductsCount: number;
  productCategories: ProductCategory[];
}

export default function FilterProducts({ totalProductsCount, productCategories }: FilterProductsProps) {
  const btnFilterRef = useRef<HTMLButtonElement>(null);

  const { open, setOpen, handleReset, handleFilter } = useFilterProducts();

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
  }, [open, setOpen]);

  return (
    <div className="flex items-center gap-1">
      <FilterProductSearch totalProductsCount={totalProductsCount} />
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
                <h3>Filter {totalProductsCount} Product</h3>
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
                <FilterSortPrice />
                <FilterProductCategory productCategories={productCategories} />

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

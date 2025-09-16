"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const [inputPage, setInputPage] = useState(String(currentPage));

  // Sinkronkan state input dengan currentPage dari URL
  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  const handleInputJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
        router.push(createPageURL(pageNum));
      } else {
        setInputPage(String(currentPage));
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={createPageURL(currentPage - 1)}>
        <button
          type="button"
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
        >
          &laquo; Prev
        </button>
      </Link>

      <label htmlFor="page" className="sr-only">
        page
      </label>
      <input
        type="number"
        id="page"
        name="page"
        value={inputPage}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setInputPage(e.target.value)}
        onKeyDown={handleInputJump}
        className="w-12 text-center border rounded-md"
        min="1"
        max={totalPages}
      />
      <span>/ {totalPages}</span>

      <Link href={createPageURL(currentPage + 1)}>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
        >
          Next &raquo;
        </button>
      </Link>
    </div>
  );
}

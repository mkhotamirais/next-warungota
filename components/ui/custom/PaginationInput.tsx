"use client";

import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "../input";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  path: string;
}

export default function PaginationInput({ totalPages, currentPage, path }: PaginationProps) {
  const [inputPage, setInputPage] = useState(String(currentPage));

  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const handleInputJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
        // Navigasi menggunakan Next.js Link
        window.location.href = `${path}/${pageNum}`;
      } else {
        // Reset input jika tidak valid
        setInputPage(String(currentPage));
      }
    }
  };

  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem aria-disabled={currentPage <= 1}>
          <PaginationPrevious
            aria-disabled={currentPage <= 1}
            href={`${path}/${prevPage}`}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        <Input
          type="number"
          id="page"
          name="page"
          value={inputPage}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyDown={handleInputJump}
          className="w-18 text-center border rounded-md disabled:opacity-50"
          min="1"
          max={totalPages}
          disabled={totalPages <= 1}
        />
        <span>/ {totalPages}</span>

        <PaginationItem>
          <PaginationNext
            aria-disabled={currentPage >= totalPages}
            href={`${path}/${nextPage}`}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

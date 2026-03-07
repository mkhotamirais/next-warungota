"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  path: string;
}

export default function PaginationDots({ totalPages, currentPage, path }: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  const renderNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // Halaman Pertama & Ellipsis Awal
    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <a href={`${path}/1`} className="px-3 py-2 border hover:bg-gray-100">
            1
          </a>
        </PaginationItem>,
      );
      if (startPage > 2) pages.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    // Rentang Halaman Tengah
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem
          key={i}
          className={`${i === currentPage ? "bg-gray-800 text-white" : "hover:bg-gray-100"} border`}
        >
          <a href={`${path}/${i}`} className="px-3 py-2">
            {i}
          </a>
        </PaginationItem>,
      );
    }

    // Ellipsis Akhir & Halaman Terakhir
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<PaginationEllipsis key="end-ellipsis" />);
      pages.push(
        <PaginationItem key={totalPages}>
          <a href={`${path}/${totalPages}`} className="px-3 py-2 border hover:bg-gray-100">
            {totalPages}
          </a>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent className="flex-wrap justify-center gap-1">
        {/* Tombol Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={`${path}/${prevPage}`}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {/* Angka Paginasi Dinamis */}
        {renderNumbers()}

        {/* Tombol Next */}
        <PaginationItem>
          <PaginationNext
            href={`${path}/${nextPage}`}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

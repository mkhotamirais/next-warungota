"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  path: string;
}

export default function PaginationNumber({ totalPages, currentPage, path }: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
  const numbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Pagination>
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem aria-disabled={currentPage <= 1}>
          <PaginationPrevious
            aria-disabled={currentPage <= 1}
            href={`${path}/${prevPage}`}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {numbers.map((number) => (
          <PaginationItem
            aria-current={number === currentPage}
            key={number}
            className={`${number === currentPage ? "bg-gray-800 text-white" : ""} cursor-pointer px-1 hover:bg-gray-100`}
          >
            <a href={`${path}/${number}`}>{number}</a>
          </PaginationItem>
        ))}

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

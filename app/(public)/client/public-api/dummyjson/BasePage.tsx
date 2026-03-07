"use client";

import PaginationDots from "@/components/ui/custom/PaginationDots";
import PaginationInput from "@/components/ui/custom/PaginationInput";
import PaginationNumber from "@/components/ui/custom/PaginationNumber";

interface Props {
  data: { id: number; title: string }[];
  page: number;
  totalPages: number;
}

export default function BasePage({ data, page, totalPages }: Props) {
  return (
    <div className="container">
      <div className="grid grid-cols-3 gap-1">
        {data?.map((item: { id: number; title: string }, i) => (
          <div key={i} className="border p-1 px-2 rounded-lg text-sm">
            {item.title}
          </div>
        ))}
      </div>
      <div className="space-y-4 mt-8">
        <div>
          <p>Paginasi Input</p>
          <PaginationInput totalPages={totalPages} currentPage={page} path="/client/public-api/dummyjson/page" />
        </div>
        <div>
          <p>Paginasi Number</p>
          <PaginationNumber totalPages={totalPages} currentPage={page} path="/client/public-api/dummyjson/page" />
        </div>
        <div>
          <p>Paginasi Dots</p>
          <PaginationDots totalPages={totalPages} currentPage={page} path="/client/public-api/dummyjson/page" />
        </div>
      </div>
    </div>
  );
}

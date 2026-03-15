"use client";

import { Button } from "../ui/button";
import { ProductCategory } from "@/lib/generated/prisma";
import { useProductCategory } from "@/hooks/tanstack/useProductCategory";

export default function HomeProductCategoryList() {
  const { data } = useProductCategory();

  const categories = (data as ProductCategory[]) || [];

  return (
    <section className="container py-4">
      <div className="flex gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        {categories
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <Button variant={"outline"} key={category.id} size={"sm"} className="capitalize">
              {category.name}
            </Button>
          ))}
      </div>
    </section>
  );
}

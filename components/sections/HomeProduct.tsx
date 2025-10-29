import { ProductProps } from "@/types/types";
import React from "react";
import { content as c } from "@/lib/content";
import ProductCard from "./ProductCard";
import Button from "../ui/Button";
import Link from "next/link";
import { sortProductsImageFirst } from "@/lib/utils";

const { title, description } = c.product;

export default function HomeProduct({ products }: { products: ProductProps[] | undefined | null }) {
  const orderedProductsHasImageFirst = sortProductsImageFirst(products || []);

  return (
    <section className="py-10">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="h2 mb-2">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="grid-all-list">
          {orderedProductsHasImageFirst?.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button as={Link} href="/product" className="py-3 px-">
            Semua Produk
          </Button>
        </div>
      </div>
    </section>
  );
}

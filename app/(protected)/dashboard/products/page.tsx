"use client";

import PendingPage from "@/components/PendingPage";
import { Button } from "@/components/ui/button";
import { useFetchProducts } from "@/lib/hooks/useFetchProducts";
import { IProduct } from "@/lib/types";
import { Edit, Info, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Products() {
  const { products, pendingProducts } = useFetchProducts();

  let content;
  if (pendingProducts) {
    content = <PendingPage />;
  } else {
    if (!products || products.length === 0) {
      content = <p>No products found</p>;
    } else {
      content = (
        <div className="">
          {products.map((product: IProduct) => (
            <div key={product.id} className="border rounded flex justify-between items-center mb-1">
              <div className="flex gap-2 items-center">
                <Image src={`/logo-mkhotami.png`} width={50} height={50} alt={product.name} className="size-10" />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                </div>
              </div>
              <div className="flex gap-1 mr-2">
                <Link href={`/dashboard/products/edit/${product.id}`}>
                  <Button size={"icon"} aria-label="Edit">
                    <Edit />
                  </Button>
                </Link>
                <Link href={`/products/show/${product.id}`}>
                  <Button variant={"outline"} size={"icon"} aria-label="Detail">
                    <Info />
                  </Button>
                </Link>
                <Button variant="destructive" size={"icon"} aria-label="Delete">
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <section>
      <div className="container">
        <div className="max-w-lg">
          <h1 className="h1">Products</h1>
          {content}
        </div>
      </div>
    </section>
  );
}

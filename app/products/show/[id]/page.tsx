"use client";

import PendingPage from "@/components/PendingPage";
import { useFetchProductById } from "@/lib/hooks/useFetchProductById";
import { useParams } from "next/navigation";

export default function ShowProduct() {
  const params = useParams();
  const { id } = params;
  const { product, pendingProduct } = useFetchProductById(id?.toString());

  let content;
  if (pendingProduct) {
    content = <PendingPage />;
  } else {
    if (product) {
      content = <p>{product.name}</p>;
    } else {
      content = <p>Product not found</p>;
    }
  }
  return (
    <section>
      <div className="container">
        <h1 className="h1">Product Detail</h1>
        {content}
      </div>
    </section>
  );
}

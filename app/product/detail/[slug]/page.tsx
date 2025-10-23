import { getProductBySlug, getProducts } from "@/actions/product";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import AddToCart from "./AddToCart";
import ProductCard from "@/components/sections/ProductCard";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  return { title: product?.name };
};

export const generateStaticParams = async () => {
  const { products } = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
};

export default async function ProductSlug({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);
  const { products: otherProducts } = await getProducts({ limit: 3, excludeSlug: slug });

  if (!slug || !product || !otherProducts.length) return notFound();

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-1/2">
            <Image
              src={product.imageUrl || "/logo-warungota.png"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-auto bg-gray-50 object-contain object-center"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <h1 className="h1">{product.name}</h1>
            <p className="text-2xl font-medium">{formatRupiah(product.price)}</p>
            <div>
              <AddToCart productId={product.id} />
            </div>
          </div>
        </div>
        <div className="py-8">
          <h2 className="h2 mb-4">Other Products</h2>
          <div className="grid-all-list">
            {otherProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

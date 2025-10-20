import { getProductBySlug, getProducts } from "@/actions/product";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import AddToCart from "./AddToCart";

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
        <div className="flex gap-8">
          <div className="w-1/2">
            <Image
              src={product.imageUrl || "/logo-warungota.png"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div>
            <h1 className="h1">{product.name}</h1>
            <p className="text-2xl font-medium">{formatRupiah(product.price)}</p>
            <div>
              <AddToCart productId={product.id} />
            </div>
          </div>
        </div>
        <div className="py-8">
          <h2 className="h2">Other Products</h2>
          <div className="grid grid-cols-4 gap-4">
            {otherProducts.map((item) => (
              <Link
                href={`/product/detail/${item.slug}`}
                key={item.id}
                className="group shadow rounded overflow-hidden"
              >
                <Image
                  src={item.imageUrl || "/logo-warungota.png"}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-full h-56 object-cover object-center rounded"
                />
                <div className="p-3">
                  <h3 className="h3 group-hover:underline">{item.name}</h3>
                  <p className="text-xl font-medium">{formatRupiah(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

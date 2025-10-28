import { getProductBySlug, getProducts } from "@/actions/product";
import { notFound } from "next/navigation";
import React from "react";
import OtherProducts from "./OtherProducts";
import DetailProduct from "./DetailProduct";

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
  const currentProductCategory = product?.ProductCategory;
  const { products: otherProducts } = await getProducts({
    limit: 12,
    excludeSlug: slug,
    categorySlug: currentProductCategory?.slug,
  });

  if (!slug || !product) return notFound();

  return (
    <section className="py-8">
      <div className="container">
        <DetailProduct product={product} />
        <OtherProducts otherProducts={otherProducts} />
      </div>
    </section>
  );
}

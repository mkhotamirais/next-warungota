"use client";

import { ProductCategory } from "@/lib/generated/prisma";
import { useParams } from "next/navigation";
import EditProductForm from "./EditProductForm";
import { useProductDetail } from "@/hooks/tanstack/useProduct";
import { useProductCategory } from "@/hooks/tanstack/useProductCategory";
import Load from "@/components/fallbacks/Load";

export default function EditProductWrapper() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isPending } = useProductDetail(slug);
  const { data: productCategories }: { data: ProductCategory[] | undefined } = useProductCategory();

  if (isPending) return <Load />;

  return <EditProductForm key={product?.id} product={product} productCategories={productCategories || []} />;
}

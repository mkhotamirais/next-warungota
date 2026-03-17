import { getProductBySlug, getProducts } from "@/actions/product";
import { notFound } from "next/navigation";
import { content } from "@/lib/constants";
import DetailProduct from "./DetailProduct";
import OtherProducts from "./OtherProducts";

const p = content.product;

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  return { title: product?.name || p.title, description: product?.description || p.description };
};

export const generateStaticParams = async () => {
  const { products } = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
};

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
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
    <main className="flex-1">
      <DetailProduct product={product} />
      <OtherProducts otherProducts={otherProducts} />
    </main>
  );
}
